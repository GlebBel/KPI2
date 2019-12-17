import * as multer from 'multer';
import {UploadOptions} from 'routing-controllers';
import {v4 as uuid} from 'uuid';

import config from '../../configuration/Config';

export function getUploadConfig(): UploadOptions {
    return {
        required: false,
        options: {
            storage: multer.diskStorage({
                filename: function (req, file, cb) {
                    cb(null, `${uuid()}.${file.mimetype.split('/', 2)[1]}`);
                },
            }),
            limits: {
                fileSize: config.fileStorage.avatarMaxSize
            }
        }
    };
}
