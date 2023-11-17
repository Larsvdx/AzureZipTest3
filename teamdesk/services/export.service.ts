import { TeamDeskHttpService } from "./team.desk.http.service";
import { difference } from "../../util/array.util";
import { DifferenceInterface } from "../../shared/models/general";

export class ExportService {
  private teamDeskHttpDataService: TeamDeskHttpService;

  constructor(apiToken: string) {
    this.teamDeskHttpDataService = new TeamDeskHttpService(apiToken);
  }

  async toJson(url: string, oldData: any[] | undefined) {
    let result: any[] = [];
    let resultSet = [];
    let skip = 0;
    do {
      resultSet = [];
      resultSet = (await this.teamDeskHttpDataService.getTeamDeskData(
        url.replace("{{skip}}", skip.toString()),
      )) as [];
      result = [...result, ...resultSet];
      skip = skip + 500;
    } while (resultSet.length > 0);

    //if (result &&result.length>0 && result[0].Process) result = [...result,{ '@row.id': 959, process_id: '910', Process: '4D Printing tester 6' }]
    //if (result &&result.length>0&&result[0].pm_id_pbc) {result.pop(); result.pop(); console.log('PRODUCT POP')}
    //if (result && result.length>0 && result[0].feature_id) result = [...result,{ '@row.id': 1932,  feature_id: '280',  'Special Feature': 'Wear 3 Resistant TEST',special_feature_text: null }]

    let diff: { deletedJson: any[]; newJson: any[] };

    if (oldData && Array.isArray(oldData) && oldData.length > 0) {
      diff = this.exportToDiffJson(result, oldData);
    }

    return { teamDeskData:result, diff };
  }

  generateUrl(host: string, endpoint: string, businessContext: string): string {
    return `${host}${endpoint}`.replace("{{businessContext}}", businessContext);
  }

  private exportToDiffJson(
    newExportJson: any[],
    oldExportJson: any[],
  ): DifferenceInterface {
    let newAndUpdated = this.getNewAndUpdated(newExportJson, oldExportJson);
    const deletedAndUpdated = this.getDeletedAndUpdated(
      oldExportJson,
      newExportJson,
    );
    const deleted = this.getDeleted(deletedAndUpdated, newAndUpdated);

    // ignore shifted data when a data point in the middle of the table is deleted
    if(deleted && deleted.length>0){
      const updatedOldExportJson = oldExportJson
      deleted.forEach((deletedItem: any)=> {
        const index = updatedOldExportJson.map((json: any)=>json['@row.id']).findIndex((id)=>id===deletedItem['@row.id'])
        if(index!==-1) updatedOldExportJson.splice(index,1)
      })
      newAndUpdated = this.getNewAndUpdated(newExportJson, updatedOldExportJson);
    }

    return { deletedJson: deleted, newJson: newAndUpdated };
  }

  private getDeleted(deletedAndUpdated: any[], newAndUpdated: any[]) {
    return deletedAndUpdated
      .filter(
        (x) =>
          newAndUpdated.findIndex((y: any) => y["@row.id"] === x["@row.id"]) <
          0,
      )
      .sort((x, y) => (x["@row.id"] < y["@row.id"] ? -1 : 1));
  }

  private getDeletedAndUpdated(oldExportJson: any, newExportJson: any) {
    return difference(
      oldExportJson.sort(
        (x: { [x: string]: number }, y: { [x: string]: number }) =>
          x["@row.id"] < y["@row.id"] ? -1 : 1,
      ),
      newExportJson.sort(
        (x: { [x: string]: number }, y: { [x: string]: number }) =>
          x["@row.id"] < y["@row.id"] ? -1 : 1,
      ),
    );
  }

  private getNewAndUpdated(newExportJson: any, oldExportJson: any) {
    return difference(
      newExportJson.sort(
        (x: { [x: string]: number }, y: { [x: string]: number }) =>
          x["@row.id"] < y["@row.id"] ? -1 : 1,
      ),
      oldExportJson.sort(
        (x: { [x: string]: number }, y: { [x: string]: number }) =>
          x["@row.id"] < y["@row.id"] ? -1 : 1,
      ),
    );
  }
}
