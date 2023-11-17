import { generateContentfulId } from '../../util/contentful.util';
import { PolymerSubgroup } from '../../teamdesk/models/polymer-subgroup';
import {ContentfulMapper} from "./base/contentful.mapper";
export class PolymerSubgroupMapper {
    private spaceId: string;
    private environment: string;

    constructor(spaceId: string, environment: string) {
        this.spaceId = spaceId;
        this.environment = environment;
    }

    map(subgroup: PolymerSubgroup): any {
        const contentModel = 'polymer-subgroup';
        return ContentfulMapper
            .createContentModelBase(this.spaceId, this.environment, 'polymer-subgroup', subgroup.Subgroup_id)
            .addFields({
                "name": {
                    "en": subgroup.Subgroup
                },
                "group": {
                    'en': {
                        "sys": {
                            "type": "Link",
                            "linkType": "Entry",
                            "id": generateContentfulId('polymer-group', subgroup.polymer_group_id)
                        }
                    }
                }
            })
            .build();
    }
}
