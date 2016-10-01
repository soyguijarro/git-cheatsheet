import compose from 'ramda/src/compose';

import { toLowerCase } from './text-transformers';

const getKeyNameFromCode = compose(toLowerCase, String.fromCharCode);
const getKeyNameFromEvent = ({ key, keyCode }) => key || getKeyNameFromCode(keyCode);

export default keyName => event => getKeyNameFromEvent(event) === keyName;
