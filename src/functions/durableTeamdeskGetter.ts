import { app, input, InvocationContext, output, Timer } from "@azure/functions";
import * as df from "durable-functions";
import {
  ActivityHandler,
  EntityContext,
  EntityHandler,
  EntityId,
  OrchestrationContext,
  OrchestrationHandler,
} from "durable-functions";
import { OptionValues } from "commander";
import { exportData } from "../../teamdesk/scripts/export";
import { archiveContent } from "../../contentful/scripts/archive";
import {
  DifferenceInterface,
  EndPointInterface,
  KeyValuePair,
} from "../../shared/models/general";
import { endPoints } from "../../teamdesk/configurations/endpoints.config";
import { formatData } from "../../shared/functions/data-formatter";
import { logData } from "../../shared/functions/data-logger";
import { importContent } from "../../contentful/scripts/import";
import { importCaseStudyImages } from "../../contentful/scripts/import-case-study-images";
require("dotenv").config();

const blobInput = input.storageBlob({
  path: "samples-workitems/syncBlobDataStorage",
  connection: "AzureWebJobsStorage",
});

const blobOutput = output.storageBlob({
  path: "samples-workitems/syncBlobDataStorage",
  connection: "AzureWebJobsStorage",
});

const contentfulOptions: OptionValues = {
  spaceId: process.env.CONTENTFUL_OPTIONS_SPACEID,
  environment: process.env.CONTENTFUL_OPTIONS_ENV,
  apiKey: process.env.CONTENTFUL_OPTIONS_APIKEY,
};

const durableTeamdeskGetterOrchestrator: OrchestrationHandler = function* (
  context: OrchestrationContext
) {
  const initialInput = context.df.getInput() as {
    blobInput: KeyValuePair[];
    entityId: EntityId;
  };
  const entityId = initialInput.entityId;
  const input = initialInput.blobInput as KeyValuePair[];
  let outputs: KeyValuePair[] = Array.isArray(input) ? input : [];

  // Get data from team desk
  const teamDeskData = yield context.df.callActivity("durableTeamdeskGetter", {
    inputData: input,
    endPoints,
  });
  if (!context.df.isReplaying) context.log("TEAMDESK GETTER TASK DONE");

  const formattedOutput: KeyValuePair[] = formatData(teamDeskData, outputs);

  // Store data to blob storage
  yield context.df.callEntity(entityId, "set", formattedOutput);
  context.df.setCustomStatus("readyForStorage");

  if (!context.df.isReplaying) logData(context, teamDeskData);

  // Archive deleted data in contentful
  yield context.df.callActivity("durableContentfullArchive", teamDeskData);

  // Add or update new data in contentful
  yield context.df.callActivity("durableContentfullUploadNew", teamDeskData);

  // Add case study pictures in contentful
  yield context.df.callActivity("durableImportCaseStudyImages", teamDeskData);

  return formattedOutput;
};
df.app.orchestration(
  "durableTeamdeskGetterOrchestrator",
  durableTeamdeskGetterOrchestrator
);

const durableTeamdeskGetter: ActivityHandler = async (input: {
  inputData: KeyValuePair[];
  endPoints: EndPointInterface[];
}): Promise<
  { teamDeskData: any[]; diff: DifferenceInterface; endpoint: string }[]
> => {
  const options = {
    config: process.env.TEAMDESK_OPTIONS_CONFIG,
    businessContext: process.env.TEAMDESK_OPTIONS_BC,
    apiKey: process.env.TEAMDESK_OPTIONS_APIKEY,
    host: process.env.TEAMDESK_OPTIONS_HOST,
  };

  return await exportData(options, input);
};
df.app.activity("durableTeamdeskGetter", { handler: durableTeamdeskGetter });

const durableContentfullUploadNew: ActivityHandler = async (
  input: { endpoint: string; diff: DifferenceInterface; teamDeskData: any[] }[]
) => {
  return await importContent(contentfulOptions, input);
};
df.app.activity("durableContentfullUploadNew", {
  handler: durableContentfullUploadNew,
});

const durableContentfullArchive: ActivityHandler = async (
  input: { endpoint: string; diff: DifferenceInterface; teamDeskData: any[] }[]
) => {
  return await archiveContent(contentfulOptions, input);
};
df.app.activity("durableContentfullArchive", {
  handler: durableContentfullArchive,
});

const durableImportCaseStudyImages: ActivityHandler = async (
  input: { endpoint: string; diff: DifferenceInterface; teamDeskData: any[] }[]
) => {
  const caseStudies = input.find((data) => data.endpoint === "caseStudy");
  if (caseStudies.diff?.newJson) {
    return await importCaseStudyImages(
      contentfulOptions,
      caseStudies.diff.newJson
    );
  }
};
df.app.activity("durableImportCaseStudyImages", {
  handler: durableImportCaseStudyImages,
});

const durableEntityBlobOutput: EntityHandler<KeyValuePair[]> = (
  context: EntityContext<KeyValuePair[]>
) => {
  context.log("ENTERING DURABLE ENTITY");
  const currentValue = context.df.getState(() => []);
  switch (context.df.operationName) {
    case "set":
      const data = context.df.getInput();
      context.df.setState(data);
      break;
    case "get":
      context.df.return(currentValue);
      break;
  }
};
df.app.entity("durableEntityBlobOutput", { handler: durableEntityBlobOutput });

export async function timerTrigger(
  myTimer: Timer,
  context: InvocationContext
): Promise<void> {
  const entityId = new df.EntityId("durableEntityBlobOutput", "syncBlobOutput");
  const client = df.getClient(context);
  const instanceId: string = await client.startNew(
    "durableTeamdeskGetterOrchestrator",
    {
      input: {
        blobInput: context.extraInputs.get(blobInput),
        entityId: entityId,
      },
    }
  );
  context.log(`Started orchestration with ID = '${instanceId}'.`);

  let durableOrchestrationStatus = await client.getStatus(instanceId);
  while (
    durableOrchestrationStatus.customStatus?.toString() !== "readyForStorage"
  ) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    durableOrchestrationStatus = await client.getStatus(instanceId);
  }

  const stateResponse = await client.readEntityState(entityId);
  if (stateResponse?.entityState && Array.isArray(stateResponse?.entityState)) {
    context.extraOutputs.set(blobOutput, stateResponse?.entityState);
    context.log(`BLOB HAS BEEN STORED`);
  } else context.log("ERROR OCCURED");

  return;
}

// 0 */10 * * * * trigger every 10 minutes
// 0 0 1 * * * trigger every day at 1:00 am
app.timer("timerTrigger", {
  schedule: "0 0 1 * * *",
  handler: timerTrigger,
  extraOutputs: [blobOutput],
  extraInputs: [df.input.durableClient(), blobInput],
});
