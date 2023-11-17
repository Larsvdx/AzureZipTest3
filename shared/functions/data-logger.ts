import { DifferenceInterface } from "../models/general";
import { OrchestrationContext } from "durable-functions";

export function logData(
  context: OrchestrationContext,
  teamDeskData: {
    endpoint: string;
    diff: DifferenceInterface;
    teamDeskData: any[];
  }[],
) {
  const deletedData = teamDeskData
    .map((data) =>
      data.diff?.deletedJson && data.diff.deletedJson.length > 0
        ? { resource: data.endpoint, deleted: data.diff.deletedJson }
        : undefined,
    )
    .filter((data) => data);
  const newData = teamDeskData
    .map((data) =>
      data.diff?.newJson && data.diff.newJson.length > 0
        ? { resource: data.endpoint, new: data.diff.newJson }
        : undefined,
    )
    .filter((data) => data);

  for (let dataPoint of deletedData) {
    context.log(
      dataPoint.resource +
        " HAS " +
        dataPoint.deleted?.length +
        " DELETED ENTRIES!",
    );
  }
  for (let dataPoint of newData) {
    context.log(
      dataPoint.resource +
        " HAS " +
        dataPoint.new?.length +
        " NEW OR UPDATED ENTRIES!",
    );
  }
}
