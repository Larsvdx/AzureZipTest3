import { generateContentfulId } from '../../util/contentful.util';
import { PolymerGroup } from '../../teamdesk/models/polymer-group';
import {ContentfulMapper} from "./base/contentful.mapper";

export class PolymerGroupMapper {
    private spaceId: string;
    private environment: string;

    constructor(spaceId: string, environment: string) {
        this.spaceId = spaceId;
        this.environment = environment;
    }

    map(group: PolymerGroup): any {
        return ContentfulMapper
            .createContentModelBase(this.spaceId, this.environment, 'polymer-group', group.pg_id)
            .addFields({
                "name": {
                    "en": group.Polymer_Group
                },
                "family": {
                    'en': {
                        "sys": {
                            "type": "Link",
                            "linkType": "Entry",
                            "id": generateContentfulId('polymer-family', group.polymer_family_id)
                        }
                    }
                }
            })
            .build();
    }
}
