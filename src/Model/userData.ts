export interface UserData {
    _id?: string
    name: string,
    email: string,
    password: string
    role: string
    profileImage?: string | null | undefined
}