import { Base } from './base';

export interface PolymerSubgroup extends Base {
    Subgroup_id: number;
    Subgroup: string;
    subgroup_text?: string,
    polymer_group_id: number;
    perf_rating_id: number
}
