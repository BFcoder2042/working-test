export interface IPeriodsObject {
    value: Array<IPeriods>;
}

export interface IPeriods {
    Created: Date;
    DateEnd: Date;
    DateStart: Date;
    Title: string;
    Status: string;
}
