import {IsString, Matches} from 'class-validator';

export class RefreshInput {
    @IsString()
    @Matches(/refresh_token/)
    grant_type: string;

    @IsString()
    scope: string;

    @IsString()
    client_id: string;

    @IsString()
    client_secret: string;

    @IsString()
    refresh_token: string;
}
