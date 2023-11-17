import { Country } from '../../teamdesk/models/country';
import { ContentfulMapper } from "./base/contentful.mapper";

export class CountryMapper {
    private spaceId: string;
    private environment: string;

    constructor(spaceId: string, environment: string) {
        this.spaceId = spaceId;
        this.environment = environment;
    }

    map(country: Country): any {
        return ContentfulMapper
            .createContentModelBase(this.spaceId, this.environment, 'country', country.country_id)
            .addFields({
                "name": {
                    "en": country.Country
                }
            })
            .build();
    }
}
