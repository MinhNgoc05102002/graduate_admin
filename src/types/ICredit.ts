import { IFolder } from "./IFolder"

export interface ICredit {
    avatar: string
    categories: any
    classes: any
    countFlashcard: number
    countLearn: number
    countLearnCal: number
    countReport: number
    createdAt: string
    createdBy: string
    creditId: string
    description: string
    flashcards: any
    folders: any
    name: string
    isLearned: boolean
}

export interface IPropsModal {
    data: any;
    callBackCheck:any;
    checked: boolean;
}

export interface IProps {
    credit: ICredit;
}