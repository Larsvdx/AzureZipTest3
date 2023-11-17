import { TeamDeskHttpService } from "./team.desk.http.service";
import { ExportOptions } from "../models/dev/export.options";
import {
  readJsonFile,
  renameJsonFile,
  writeJsonFile,
} from "../../util/filesystem.util";
import { difference } from "../../util/array.util";

export class ExportService {
  private teamDeskHttpDataService: TeamDeskHttpService;

  constructor(apiToken: string) {
    this.teamDeskHttpDataService = new TeamDeskHttpService(apiToken);
  }

  async toJson(options: ExportOptions) {
    let result: any[] = [];
    let resultSet = [];
    let skip = 0;
    do {
      resultSet = [];
      resultSet = await this.teamDeskHttpDataService.getTeamDeskData(
        options.url.replace("{{skip}}", skip.toString())
      );
      result = [...result, ...resultSet];
      skip = skip + 500;
    } while (resultSet.length > 0);

    return this.exportToJson(options, result);
  }

  generateUrl(host: string, endpoint: string, businessContext: string): string {
    return `${host}${endpoint}`.replace("{{businessContext}}", businessContext);
  }

  private exportToJson(options: ExportOptions, exportData: any): boolean {
    let succeeded = false;
    const backupOldFile = renameJsonFile(
      options.directory,
      options.filename,
      options.backupFilename
    );

    if (backupOldFile) {
      writeJsonFile(
        options.directory,
        options.filename,
        JSON.stringify(exportData)
      );

      const oldExportdata = readJsonFile(
        options.directory,
        options.backupFilename
      );
      succeeded = this.exportToDiffJson(
        options.directory,
        options.diffFilename,
        exportData,
        oldExportdata
      );
    }

    return succeeded;
  }

  private exportToDiffJson(
    directory: string,
    filename: string,
    newExportJson: any,
    oldExportJson: any
  ): boolean {
    const newAndUpdated = this.getNewAndUpdated(newExportJson, oldExportJson);
    const deletedAndUpdated = this.getDeletedAndUpdated(oldExportJson, newExportJson);
    const deleted = this.getDeleted(deletedAndUpdated, newAndUpdated);

    return writeJsonFile(
      directory,
      filename,
      JSON.stringify({ newAndUpdated, deleted }, null, 2)
    );
  }

    private getDeleted(deletedAndUpdated: any[], newAndUpdated: any[]) {
        return deletedAndUpdated
            .filter(
                (x) =>
                    newAndUpdated.findIndex((y: any) => y["@row.id"] === x["@row.id"]) < 0
            )
            .sort((x, y) => (x["@row.id"] < y["@row.id"] ? -1 : 1));
    }

    private getDeletedAndUpdated(oldExportJson: any, newExportJson: any) {
        return difference(
            oldExportJson.sort(
                (x: { [x: string]: number }, y: { [x: string]: number }) =>
                    x["@row.id"] < y["@row.id"] ? -1 : 1
            ),
            newExportJson.sort(
                (x: { [x: string]: number }, y: { [x: string]: number }) =>
                    x["@row.id"] < y["@row.id"] ? -1 : 1
            )
        );
    }

    private getNewAndUpdated(newExportJson: any, oldExportJson: any) {
        return difference(
            newExportJson.sort(
                (x: { [x: string]: number }, y: { [x: string]: number }) =>
                    x["@row.id"] < y["@row.id"] ? -1 : 1
            ),
            oldExportJson.sort(
                (x: { [x: string]: number }, y: { [x: string]: number }) =>
                    x["@row.id"] < y["@row.id"] ? -1 : 1
            )
        );
    }
}
