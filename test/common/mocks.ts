import {mock, reset} from 'ts-mockito';
import * as R from 'ramda';

const mocks = {
};

export default mocks;

export function resetAllMocks() {
    const mockPaths = [
    ];
    // @ts-ignore
    const valuesFromPath = R.curry((paths, obj) => R.ap([R.path(R.__, obj)], paths));
    valuesFromPath(mockPaths, mocks).forEach(reset);
}
