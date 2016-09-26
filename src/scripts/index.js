import compose from 'ramda/src/compose';

import { runOnCondition, addParams } from './utils/function-transformers';
import { checkKeyName } from './utils/key-events-helpers';
import { addListenerToDOMNode } from './utils/dom-node-helpers';

import { updateCheatsheet, resetSearchField, resetPage } from './event-handlers';

import { CLASSNAMES, ESC_KEY } from './constants';
import data from '../data.json';
import '../styles/main.scss';

if (module.hot) module.hot.accept();

// Page elements
const rootElt = document;
const headerLogoElt = rootElt.querySelector(`.${CLASSNAMES.LOGO}`);
const searchElt = rootElt.querySelector(`.${CLASSNAMES.SEARCH}`);

// Auxiliary functions
const isEscKeyEvent = checkKeyName(ESC_KEY);
const addContext = addParams(data, searchElt);
const runOnConditionWithContext = compose(runOnCondition, addContext);
const addLogoListener = addListenerToDOMNode(headerLogoElt);
const addSearchFieldListener = addListenerToDOMNode(searchElt);

// Event listeners
const handleSearchFieldInput = addContext(updateCheatsheet);
addSearchFieldListener('input', handleSearchFieldInput);

const handleLogoClick = addContext(resetSearchField);
addLogoListener('click', handleLogoClick);

const runResetSearchFieldIf = runOnConditionWithContext(resetSearchField);
const handleSearchFieldKeyPress = compose(runResetSearchFieldIf, isEscKeyEvent);
addSearchFieldListener('keypress', handleSearchFieldKeyPress);

// Page initialization
addContext(resetPage)();
