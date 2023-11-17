import { ExportService } from "../services/export.service";
import { OptionValues } from "commander";
import {
  DifferenceInterface,
  EndPointInterface,
  KeyValuePair,
} from "../../shared/models/general";

export async function exportData(
  options: OptionValues,
  oldData: {
    inputData: KeyValuePair[];
    endPoints: EndPointInterface[];
  },
): Promise<
  { teamDeskData: any[]; diff: DifferenceInterface; endpoint: string }[]
> {
  const exportService = new ExportService(options.apiKey);
  const output: {
    teamDeskData: any[];
    diff: DifferenceInterface;
    endpoint: string;
  }[] = [];

  for (const endpoint of oldData.endPoints) {
    const inputData = Array.isArray(oldData.inputData)
      ? oldData.inputData.find((record) => record.key === endpoint.resource)
      : undefined;
    output.push({
      ...(await exportService.toJson(
        exportService.generateUrl(
          options.host,
          endpoint.url,
          options.businessContext,
        ),
        inputData ? inputData.value : undefined,
      )),
      endpoint: endpoint.resource,
    });
  }
  return output;
}
