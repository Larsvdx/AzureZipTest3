import { Feature } from '../../teamdesk/models/feature';
import { ContentfulMapper } from "./base/contentful.mapper";
export class FeatureMapper {
    private spaceId: string;
    private environment: string;

    constructor(spaceId: string, environment: string) {
        this.spaceId = spaceId;
        this.environment = environment;
    }

    map(feature: Feature): any {
        return ContentfulMapper
            .createContentModelBase(this.spaceId, this.environment, 'feature', feature.feature_id)
            .addFields({
                "name": {
                    "en": feature['Special Feature']
                }
            })
            .build();
    }
}
