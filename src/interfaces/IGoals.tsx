export interface IUserGoalsObject {
    value: Array<IUserGoals>
}

export interface IUserGoals {
    Id: number;
    Status: string;
    AssignedId: number;
    AuthorId: number;
    Created: Date;
    DateDeadline: string;
    DateEnd: Date;
    DateStart: Date;
    Description: string;
    EditorId: number;
    Modified: Date;
    CertificationPeriod: Object;
    NameGoal: Object;
}
  