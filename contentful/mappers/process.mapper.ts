import { Process } from '../../teamdesk/models/process';
import { ContentfulMapper } from "./base/contentful.mapper";
export class ProcessMapper {
    private spaceId: string;
    private environment: string;

    constructor(spaceId: string, environment: string) {
        this.spaceId = spaceId;
        this.environment = environment;
    }

    map(process: Process): any {
         return ContentfulMapper
             .createContentModelBase(this.spaceId, this.environment, 'process', process.process_id)
             .addFields({
                 "name": {
                     "en": process.Process
                 }
             })
             .build();
    }
}
