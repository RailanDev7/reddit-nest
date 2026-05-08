import { IsEmail, IsString, IsStrongPassword } from "class-validator";

export class CreateAuthDto {
    @IsEmail({}, { message: "Please provide a valid email address" })
    email!: string;
    @IsStrongPassword({
        minLength: 8
    },
        { message: 'Password is too weak' })
    password!: string;
}
