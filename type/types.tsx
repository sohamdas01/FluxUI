export type ProjectType={
    id:string,
    projectId:string,
    userInput:string,
    device:string,
    createdOn:string,
    projectName?:string,
    theme?:string,
    projectVisualDescription?: string
}

export type ScreenConfigType={
    id:string,
    screenId:string,
    screenName:string,
    purpose:string,
    screenDescription:string,
    code:string
}