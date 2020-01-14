import {IsString} from 'class-validator';

interface AuthTokenResponseConstructionObject {
    accessToken: string;

    refreshToken: string;
}

export class AuthTokenResponse {
    @IsString()
    accessToken: string;

    @IsString()
    refreshToken: string;

    public static fromObject(constrObject: AuthTokenResponseConstructionObject) {
        let newToken = new AuthTokenResponse();
        newToken.accessToken = constrObject.accessToken;
        newToken.refreshToken = constrObject.refreshToken;
        return newToken;
    }
}
