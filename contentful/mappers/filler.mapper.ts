import { Filler } from '../../teamdesk/models/fillers';
import { ContentfulMapper } from "./base/contentful.mapper";
import {ProductFiller} from "../../teamdesk/models/product";
import {generateContentfulId} from "../../util/contentful.util";

export class FillerMapper {
    private spaceId: string;
    private environment: string;

    constructor(spaceId: string, environment: string) {
        this.spaceId = spaceId;
        this.environment = environment;
    }

    map(filler: Filler): any {
        return ContentfulMapper
            .createContentModelBase(this.spaceId, this.environment, 'filler', filler.filler_id)
            .addFields({
                "name": {
                    "en": filler.Filler
                }
            })
            .build();
    }

    mapProductFillers(productFiller: ProductFiller): any {
        return ContentfulMapper
            .createContentModelBase(this.spaceId, this.environment, 'product-filler', productFiller["@row.id"])
            .addFields({
                filler: {
                    en: {
                        sys: {
                            type: "Link",
                            linkType: "Entry",
                            id: generateContentfulId("filler", productFiller.filler_id),
                        }
                    }
                },
                percentage: { en: productFiller["Filler Perc"] ?? 0 }
            })
            .build();
    }
}
