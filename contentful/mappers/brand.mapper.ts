import { Brand, BrandCountry } from '../../teamdesk/models/brand';
import { generateContentfulId } from '../../util/contentful.util';
import { ContentfulMapper } from "./base/contentful.mapper";

export class BrandMapper {
    private spaceId: string;
    private environment: string;

    constructor(spaceId: string, environment: string) {
        this.spaceId = spaceId;
        this.environment = environment;
    }

    map(brand: Brand, brandCountries: Array<BrandCountry>): any {
        return ContentfulMapper
            .createContentModelBase(this.spaceId, this.environment, 'brand', brand.brand_id)
            .addFields({
                'name': {
                    'en': brand.Brand
                },
                'slug': {
                    'en': `${brand.brand_id}-${brand.Brand.replace(/ /g, '-').toLowerCase()}`
                },
                'producer': {
                    'en': {
                        'sys': {
                            'type': 'Link',
                            'linkType': 'Entry',
                            'id': generateContentfulId('producer', brand.producer_id)
                        }
                    }
                },
                'countries': { 'en': this.mapBrandCountries(brandCountries) }
            })
            .build();
    }

    private mapBrandCountries(brandCountries: Array<BrandCountry>): any[] {
        const result: any[] = [];
        brandCountries.forEach((x) => {
            result.push({
                'sys': {
                    'type': 'Link',
                    'linkType': 'Entry',
                    'id': generateContentfulId('country', x.country_id)
                }
            });
        });
        return result;
    }
}
