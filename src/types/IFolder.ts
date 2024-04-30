import { ICredit } from "./ICredit"

export interface IFolder {
    countCredit: number
    createdAt: string
    createdBy: string
    description: string
    folderId: string
    isDeleted: boolean
    name: string
    avatar: string
    credits: ICredit[]
}

export interface IProps {
    folder: IFolder;
}