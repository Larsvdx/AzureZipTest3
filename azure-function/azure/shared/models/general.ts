export interface KeyValuePair {
    key:string,
    value:any[]
}

export interface EndPointInterface {
    resource:string,
    url:string
}

export interface DifferenceInterface {
    deletedJson: any[],
    newJson: any[] 
}