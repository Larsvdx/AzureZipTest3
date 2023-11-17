import { Base } from './base';

export interface Product extends Base {
    pkb_id:number;
    Grade: string;
    brand_id: number;
    form_id: string;
    subgroup_id: number;
    quality_id: string;
    Description: string;
    pm_id_pbc: string;
    'UL product_id': number;
    UL_in_portfolio: boolean;
    Preferred: boolean;
    rank_prd: number;
    Date_Modified_All_product?: string;
}

export interface ProductFiller extends Base {
    filler_id: number;
    pkb_id: number;
    'Filler Perc': number;
}

export interface ProductFeature extends Base {
    feature_id: number;
    pkb_id: number;
}

export interface ProductSpecification extends Base {
    'specification id': number;
    'pkb id': number;
}

export interface ProductProcess extends Base {
    process_id: number;
    pkb_id: number;
}

export interface ProductSegment extends Base {
    segment_id: number;
    pkb_id: number;
}
