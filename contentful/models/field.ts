import { SysLinkEntry } from './sys-link-entry';

export interface Field {
    [key: string]: string | SysLinkEntry | number | boolean;
}
