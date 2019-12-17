import {injectable} from 'inversify';
import {Twilio} from 'twilio';
import config from '../Config';

@injectable()
export class TwilioClient {
    public client: Twilio;

    constructor() {
        this.client = new Twilio(config.twilio.accountId, config.twilio.authToken);
    }
}

const TwilioClientType = Symbol.for('TwilioClient');

export {TwilioClientType};
