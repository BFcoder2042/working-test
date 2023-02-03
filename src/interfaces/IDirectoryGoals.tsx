export interface IDirectoryGoalsObject {
    value: Array<IDirectoryGoals>
}

export interface IDirectoryGoals {
    Id: number;
    Description: string;
    Tags: Array<any>;
    AchievementCriteria: string;
    Title: string;
}
  