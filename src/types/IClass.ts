export interface IClass {
    classId: string
    name: string
    description: string
    createdAt: string
    createdBy: string
    acceptEdit: boolean
    isDeleted: boolean
    status: string
    countReport: number
    countJoinDTO: number
    countCredit: number
    joined: boolean
}

export interface IProps {
    class: IClass;
}