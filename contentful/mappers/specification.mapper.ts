import {Provider, Specification} from '../../teamdesk/models/specification';
import {ContentfulMapper} from "./base/contentful.mapper";
export class SpecificationMapper {
    private spaceId: string;
    private environment: string;

    constructor(spaceId: string, environment: string) {
        this.spaceId = spaceId;
        this.environment = environment;
    }

    map(specification: Specification, providers: Array<Provider>): any {
        return ContentfulMapper
            .createContentModelBase(this.spaceId, this.environment, 'specification', specification['Specification Id'])
            .addFields({
                "name": {
                    "en": specification.Specification
                },
                "type": {
                    "en": providers.length > 0 ? providers[0]["Provider Name"] : '-'
                }
            })
            .build();
    }
}
