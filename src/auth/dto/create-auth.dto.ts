import { IsEmail, IsString, IsStrongPassword, MaxLength } from "class-validator";
import { Transform } from "class-transformer";
export class CreateAuthDto {
    @IsString()

    @Transform(({ value }) => value.trim())

    @IsEmail({}, { message: "Please provide a valid email address" })
    email!: string;

    @IsString()

    @Transform(({ value }) => value.trim())
    @MaxLength(15)
    @IsStrongPassword({
        minLength: 8,
        minNumbers: 0,
        minSymbols: 0,
    },

    { message: 'Password is too weak' })

    password!: string;
}
