import {IsAlpha, IsPhoneNumber, Length} from 'class-validator';

export class SendCodeInput {
    @IsPhoneNumber('ZZ')
    phone: string;
}

