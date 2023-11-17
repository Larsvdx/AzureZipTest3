import { Quality } from '../../teamdesk/models/quality';
import {ContentfulMapper} from "./base/contentful.mapper";
export class QualityMapper {
    private spaceId: string;
    private environment: string;

    constructor(spaceId: string, environment: string) {
        this.spaceId = spaceId;
        this.environment = environment;
    }

    map(quality: Quality): any {
        return ContentfulMapper
            .createContentModelBase(this.spaceId, this.environment, 'quality', quality.code_id)
            .addFields({
                "name": {
                    "en": quality['code description']
                }
            })
            .build();
    }
}
