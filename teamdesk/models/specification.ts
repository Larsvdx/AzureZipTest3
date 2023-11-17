import { Base } from './base';

export interface Specification extends Base {
    'Specification Id': string;
    Specification: string;
    'Provider id': string
}

export interface Provider extends Base {
    'Provider Id': string;
    'Provider Name': string;
    'Provider Type': string;
}


