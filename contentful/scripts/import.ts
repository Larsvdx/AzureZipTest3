import {ContentfulNewAndUpdatedMapperService} from "../services/contentfulNewAndUpdatedMapperService";
import {OptionValues} from "commander";
import {DelayedQueue} from "../../util/delayed.queue.util";
import {DifferenceInterface} from "../../shared/models/general";

const contentful = require("contentful-management");

export async function importContent(
  options: OptionValues,
  input: { endpoint: string; diff: DifferenceInterface; teamDeskData: any[] }[],
) {
  const importService = new ContentfulNewAndUpdatedMapperService(
    options.spaceId,
    options.environment,
  );
  const data = importService.map(input);

  const client = contentful.createClient({
    accessToken: options.apiKey,
    environment: options.environment,
  });

  const spaceId = options.spaceId;
  const environmentId = options.environment;

  if (data && data.entries.length > 0) {
    client
      .getSpace(spaceId)
      .then((space: any) => {
        return space.getEnvironment(environmentId);
      })
      .then((environment: any) => {
        const delayedQueue = new DelayedQueue(data.entries, 750);
        delayedQueue.dequeue(async (item: any) => {
          processContentfulEntry(environment, item);
        });
      })
      .catch((error: any) => {
        console.log(error);
      });
  }
}

export async function processContentfulEntry(environment: any, item: any) {
  if (item && item.sys.type.toLowerCase() === "entry") {
    const entries = await environment.getEntries({
      "sys.id": item.sys.id,
      "sys.contentType.sys.id": item.sys.contentType.sys.id,
    });

    if (entries.items.length > 0) {
      const entry = entries.items[0];
      if (entry) {
          entry.fields = Object.assign({}, entry.fields, item.fields);
        if (!entry.isArchived()) {
          try {
            const updatedEntry = await entry.update();
            await updatedEntry
              .publish()
              .then(() => {
                console.log("Asset published");
              })
              .catch((error: any) => {
                console.log("Error occurred while publishing asset:", error);
              });
            console.log(`entry ${entry.sys?.id} updated`);
          } catch (e) {
            console.log("Error occurred while publishing asset:", e);
          }
        } else {
          console.log(`entry ${entry.sys?.id} is not published`);
        }
      }
    } else {
      const createdEntry = await environment.createEntryWithId(
        item.sys.contentType.sys.id,
        item.sys.id,
        { fields: item.fields },
      );
      await createdEntry
        .publish()
        .then(() => {
          console.log("Asset published");
        })
        .catch((error: any) => {
          console.log("Error occurred while publishing asset:", error);
        });
      console.log(`entry ${item.sys.id} created`);
    }
  }
}
