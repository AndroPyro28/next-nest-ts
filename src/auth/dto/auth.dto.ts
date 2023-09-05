import { IsEmail, IsString,IsNotEmpty } from "class-validator"

export class LoginDto {
    @IsString()
    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string
}