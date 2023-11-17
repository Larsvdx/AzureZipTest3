import { DifferenceInterface, KeyValuePair } from "../models/general";

export function formatData(
  teamDeskData: {
    endpoint: string;
    diff: DifferenceInterface;
    teamDeskData: any[];
  }[],
  outputs: KeyValuePair[],
): KeyValuePair[] {
  const newOrUpdatedEntries: KeyValuePair = {
    key: "newAndUpdatedEntries",
    value: [],
  };

  teamDeskData.map((task) => {
    const index = outputs.indexOf(
      outputs.find((record) => record.key === task.endpoint),
    );
    if (index !== -1) {
      outputs[index] = {
        key: task.endpoint,
        value: task.teamDeskData,
      };
    } else outputs.push({ key: task.endpoint, value: task.teamDeskData });
    newOrUpdatedEntries.value.push(task.endpoint);
  });

  const index = outputs.indexOf(
    outputs.find((record) => record.key === "newAndUpdatedEntries"),
  );
  if (index !== -1) {
    outputs[index] = newOrUpdatedEntries;
  } else outputs.push(newOrUpdatedEntries);

  return outputs;
}
