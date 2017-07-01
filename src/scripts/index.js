import compose from 'ramda/src/compose';
import { install as installOfflinePluginRuntime } from 'offline-plugin/runtime';

import { runOnCondition, addParams } from './utils/function-transformers';
import checkKeyNameFromEvent from './utils/check-key-name-from-event';
import { getDOMNode, addListenerToDOMNode, removeListenerFromDOMNode } from './utils/dom-node-helpers';

import { updateCheatsheet, resetSearchField, resetPage } from './event-handlers';

import { CLASSNAMES, ESC_KEY } from './constants';
import data from '../data.json';
import '../styles/main.scss';

// Page elements
const logoElt = getDOMNode(`.${CLASSNAMES.LOGO}`);
const searchFieldElt = getDOMNode(`.${CLASSNAMES.SEARCH}`);

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
addLogoListener('click', handleLogoClick);

const handleSearchFieldInput = addContext(updateCheatsheet);
addSearchFieldListener('input', handleSearchFieldInput);

const runResetSearchFieldIf = runOnConditionWithContext(resetSearchField);
const handleSearchFieldKeyUp = compose(runResetSearchFieldIf, isEscKeyEvent);
addSearchFieldListener('keyup', handleSearchFieldKeyUp);

// Page initialization
installOfflinePluginRuntime();
addContext(resetPage)();

// Hot module replacement (for development)
if (module.hot) {
  module.hot.accept();

  module.hot.dispose(() => {
    removeLogoListener('click', handleLogoClick);
    removeSearchFieldListener('input', handleSearchFieldInput);
    removeSearchFieldListener('keyup', handleSearchFieldKeyUp);
  });
}
