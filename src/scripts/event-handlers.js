import { encodeText, escapeRegExpSpecialChars } from './utils/text-transformers';
import { setDOMNodeValue, setFocusOnDOMNode } from './utils/dom-node-helpers';

import renderCheatsheet from './render-cheatsheet';
import filterData from './filter-data';

import { CHAR_ENTITIES } from './constants';

const encodeCharEntities = encodeText(CHAR_ENTITIES);
const renderCheatsheetWithEncoding = renderCheatsheet(encodeCharEntities);
export const updateCheatsheet = (data, elt) => {
  const searchString = escapeRegExpSpecialChars(elt.value);
  const filteredData = filterData(data, searchString);

  return renderCheatsheetWithEncoding(filteredData, searchString);
};

export const resetPage = (data, elt) => {
  setFocusOnDOMNode(elt);
  updateCheatsheet(data, elt);
};

export const resetSearchField = (data, elt) => {
  const setSearchEltValue = setDOMNodeValue(elt);
  setSearchEltValue('');

  resetPage(data, elt);
};
