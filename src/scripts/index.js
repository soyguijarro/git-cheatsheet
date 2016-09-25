import compose from 'ramda/src/compose';

import { encodeText } from './utils/text-transformers';
import { runOnCondition, addParams } from './utils/function-transformers';
import { checkEventType, checkKeyName } from './utils/dom-events-helpers';

import { updateCheatsheetOnInput, resetSearchField, resetPage } from './event-handlers';
import updateCheatsheet from './update-cheatsheet';

import { CHAR_ENTITIES, CLASSNAMES, KEYS, EVENT_TYPES } from './constants';
import data from '../data.json';
import '../styles/main.scss';

if (module.hot) module.hot.accept();

// Page elements
const headerLogoElt = document.querySelector(`.${CLASSNAMES.LOGO}`);
const searchElt = document.querySelector(`.${CLASSNAMES.SEARCH}`);

// Auxiliary functions
const isEscKey = checkKeyName(KEYS.ESC);
const isClick = checkEventType(EVENT_TYPES.CLICK);

const encodeCharEntities = encodeText(CHAR_ENTITIES);
const updateCheatsheetWithEncoding = updateCheatsheet(encodeCharEntities);
const addContext = addParams(data, updateCheatsheetWithEncoding, searchElt);

const runOnConditionWithContext = compose(runOnCondition, addContext);

// Event listeners
const handleSearchFieldInput = addContext(updateCheatsheetOnInput);
searchElt.addEventListener('input', handleSearchFieldInput, false);

const runResetSearchField = runOnConditionWithContext(resetSearchField);
const handleSearchFieldKeyPress = compose(runResetSearchField, isEscKey);
searchElt.addEventListener('keypress', handleSearchFieldKeyPress, false);

const handleLogoClick = compose(runResetSearchField, isClick);
headerLogoElt.addEventListener('click', handleLogoClick, false);

// Page initialization
addContext(resetPage)();
