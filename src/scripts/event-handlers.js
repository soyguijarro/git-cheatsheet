import escapeStringRegexp from 'escape-string-regexp';

import { checkKeyName, getKeyName } from './utils/dom-events-helpers';

import { KEYS } from './constants';

const isLetterKey = checkKeyName(KEYS.LETTER);

export const updateCheatsheetOnInput = (data, updateCheatsheet, elt) => {
  const searchString = escapeStringRegexp(elt.value);
  const searchRegExp = new RegExp(searchString, 'ig');
  const filteredData = data.filter(item => searchRegExp.test(item.name + item.content));

  return updateCheatsheet(filteredData, searchString);
};

export const resetPage = (data, updateCheatsheet, elt) => {
  const focusSearchFieldOnKeyUp = (event) => {
    const isLetterKeyPressed = isLetterKey(event);
    if (!isLetterKeyPressed) return;

    elt.focus();
    /* eslint-disable no-param-reassign */
    elt.value = getKeyName(event);
    /* eslint-enable no-param-reassign */

    const eventDup = new Event('input');
    elt.dispatchEvent(eventDup);

    document.removeEventListener('keyup', focusSearchFieldOnKeyUp, false);
  };

  document.addEventListener('keyup', focusSearchFieldOnKeyUp, false);
  updateCheatsheet(data);
};

export const resetSearchField = (data, updateCheatsheet, elt) => {
  /* eslint-disable no-param-reassign */
  elt.value = '';
  /* eslint-enable no-param-reassign */
  resetPage(data, updateCheatsheet, elt);
};
