import compose from 'ramda/src/compose';

import { runOnCondition, addParams } from './utils/function-transformers';
import checkKeyNameFromEvent from './utils/check-key-name-from-event';
import { addListenerToDOMNode, removeListenerFromDOMNode } from './utils/dom-node-helpers';

import { updateCheatsheet, resetSearchField, resetPage } from './event-handlers';

import { CLASSNAMES, ESC_KEY } from './constants';
import data from '../data.json';
import '../styles/main.scss';

// Page elements
const rootElt = document;
const logoElt = rootElt.querySelector(`.${CLASSNAMES.LOGO}`);
const searchFieldElt = rootElt.querySelector(`.${CLASSNAMES.SEARCH}`);

// Auxiliary functions
const isEscKeyEvent = checkKeyNameFromEvent(ESC_KEY);

const addContext = addParams(data, searchFieldElt);
const runOnConditionWithContext = compose(runOnCondition, addContext);

const addLogoListener = addListenerToDOMNode(logoElt);
const addSearchFieldListener = addListenerToDOMNode(searchFieldElt);
const removeLogoListener = removeListenerFromDOMNode(logoElt);
const removeSearchFieldListener = removeListenerFromDOMNode(searchFieldElt);

// Event listeners
const handleLogoClick = addContext(resetSearchField);
addLogoListener('click', handleLogoClick, false);

const handleSearchFieldInput = addContext(updateCheatsheet);
addSearchFieldListener('input', handleSearchFieldInput, false);

const runResetSearchFieldIf = runOnConditionWithContext(resetSearchField);
const handleSearchFieldKeyPress = compose(runResetSearchFieldIf, isEscKeyEvent);
addSearchFieldListener('keypress', handleSearchFieldKeyPress, false);

// Page initialization
addContext(resetPage)();

// Hot module replacement (for development)
if (module.hot) {
  module.hot.accept();

  module.hot.dispose(() => {
    removeLogoListener('click', handleLogoClick, false);
    removeSearchFieldListener('input', handleSearchFieldInput, false);
    removeSearchFieldListener('keypress', handleSearchFieldKeyPress, false);
  });
}
