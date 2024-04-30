interface IUser {
    username?: string,
    email?: string,
    avatar?: string
    role?: string,
    createdAt?: string,
    status?: string,
    hasWarning?:number,
    token?:string,
    refreshToken?:string
}