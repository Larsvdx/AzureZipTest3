import { generateContentfulId } from '../../util/contentful.util';
import { Segment } from '../../teamdesk/models/segment';
import {ContentfulMapper} from "./base/contentful.mapper";

export class SegmentMapper {
    private spaceId: string;
    private environment: string;

    constructor(spaceId: string, environment: string) {
        this.spaceId = spaceId;
        this.environment = environment;
    }

    map(segment: Segment): any {
        return ContentfulMapper
            .createContentModelBase(this.spaceId, this.environment, 'segment', segment.segment_id)
            .addFields({
                "name": {
                    "en": segment.Segment
                },
                "rank": {
                    "en": segment.rank
                },
                "industry": {
                    'en': {
                        "sys": {
                            "type": "Link",
                            "linkType": "Entry",
                            "id": generateContentfulId('industry', segment.industry_id)
                        }
                    }
                }
            })
            .build();
    }
}
