import { Base } from './base';

export interface Brand extends Base {
    brand_id: number;
    Brand: string;
    producer_id: number;
}

export interface BrandCountry extends Base {
    brand_id: number;
    country_id: number;
}
