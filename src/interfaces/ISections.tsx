export interface ISectionsObject {
    value: Array<ISections>;
}

export interface ISections {
    Id: number;
    Title: string;
    ParentId: number;
}