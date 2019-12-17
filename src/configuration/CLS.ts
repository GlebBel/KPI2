import {createNamespace} from 'cls-hooked';
import config from './Config';

let clsContext = createNamespace(config.cls.contextName);

export {clsContext};
