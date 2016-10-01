import { encodeText, escapeRegExpSpecialChars } from './utils/text-transformers';
import { setDOMNodeValue, setFocusOnDOMNode } from './utils/dom-node-helpers';

import renderCheatsheet from './render-cheatsheet';
import filterData from './filter-data';

import { CHAR_ENTITIES } from './constants';

const encodeCharEntities = encodeText(CHAR_ENTITIES);
const renderCheatsheetWithEncoding = renderCheatsheet(encodeCharEntities);
export const updateCheatsheet = (data, searchFieldElt) => {
  const searchString = escapeRegExpSpecialChars(searchFieldElt.value);
  const filteredData = filterData(data, searchString);

  renderCheatsheetWithEncoding(filteredData, searchString);
};

export const resetPage = (data, searchFieldElt) => {
  setFocusOnDOMNode(searchFieldElt);
  updateCheatsheet(data, searchFieldElt);
};

export const resetSearchField = (data, searchFieldElt) => {
  const setSearchFieldEltValue = setDOMNodeValue(searchFieldElt);

  setSearchFieldEltValue('');
  resetPage(data, searchFieldElt);
};
