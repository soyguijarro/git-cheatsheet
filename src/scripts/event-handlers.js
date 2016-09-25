import { encodeText, escapeRegExpSpecialChars } from './utils/text-transformers';
import { checkKeyName, getKeyName } from './utils/dom-events-helpers';

import renderCheatsheet from './render-cheatsheet';
import filterData from './filter-data';

import { CHAR_ENTITIES, KEYS } from './constants';

// Auxiliary functions
const isLetterKey = checkKeyName(KEYS.LETTER);
const encodeCharEntities = encodeText(CHAR_ENTITIES);

const renderCheatsheetWithEncoding = renderCheatsheet(encodeCharEntities);
export const updateCheatsheet = (data, elt) => {
  const searchString = escapeRegExpSpecialChars(elt.value);
  const filteredData = filterData(data, searchString);

  return renderCheatsheetWithEncoding(filteredData, searchString);
};

export const resetPage = (data, elt) => {
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
  updateCheatsheet(data, elt);
};

export const resetSearchField = (data, elt) => {
  /* eslint-disable no-param-reassign */
  elt.value = '';
  /* eslint-enable no-param-reassign */
  resetPage(data, elt);
};
