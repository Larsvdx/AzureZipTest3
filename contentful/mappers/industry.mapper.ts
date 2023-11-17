import { Industry } from '../../teamdesk/models/industry';
import {ContentfulMapper} from "./base/contentful.mapper";

export class IndustryMapper {
    private spaceId: string;
    private environment: string;

    constructor(spaceId: string, environment: string) {
        this.spaceId = spaceId;
        this.environment = environment;
    }

    map(industry: Industry): any {
        return ContentfulMapper
            .createContentModelBase(this.spaceId, this.environment, 'industry', industry.industry_id)
            .addFields({
                "name": {
                    "en": industry.Industry
                }
            })
            .build();
    }
}
