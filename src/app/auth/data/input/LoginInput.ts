import {IsPhoneNumber, IsString, Matches} from 'class-validator';

export class LoginInput {
    @IsPhoneNumber('ZZ')
    username: string;

    @IsString()
    @Matches(/\d{4}/)
    password: string;

    @IsString()
    @Matches(/password/)
    grant_type: string;

    @IsString()
    scope: string;

    @IsString()
    client_id: string;

    @IsString()
    client_secret: string;
}
