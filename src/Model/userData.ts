export interface UserDTO {
    name: string,
    email: string,
    password: string
    role: string
    profileImage?: string | null | undefined
}