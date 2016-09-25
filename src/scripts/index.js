import escapeStringRegexp from 'escape-string-regexp';
import compose from 'ramda/src/compose';

import { encodeText } from './utils/text-transformer';
import { checkEventType, checkKeyName, getKeyName } from './utils/dom-events-helper';
import runOnCondition from './utils/run-on-condition';

import updateCheatsheet from './update-cheatsheet';

import { CHAR_ENTITIES, CLASSNAMES, KEYS, EVENT_TYPES } from './constants';
import data from '../data.json';
import '../styles/main.scss';

if (module.hot) module.hot.accept();

const isLetterKey = checkKeyName(KEYS.LETTER);
const isEscKey = checkKeyName(KEYS.ESC);
const isClick = checkEventType(EVENT_TYPES.CLICK);

const encodeCharEntities = encodeText(CHAR_ENTITIES);
const updateCheatsheetWithEncoding = updateCheatsheet(encodeCharEntities);

const searchElt = document.querySelector(`.${CLASSNAMES.SEARCH}`);
const headerLogoElt = document.querySelector(`.${CLASSNAMES.LOGO}`);

const updateCheatsheetOnInput = (event) => {
  const searchString = escapeStringRegexp(event.target.value);
  const searchRegExp = new RegExp(searchString, 'ig');
  const filteredData = data.filter(item => searchRegExp.test(item.name + item.content));

  return updateCheatsheetWithEncoding(filteredData, searchString);
};

const focusSearchFieldOnKeyUp = (event) => {
  const isLetterKeyPressed = isLetterKey(event);
  if (!isLetterKeyPressed) return;

  searchElt.focus();
  searchElt.value = getKeyName(event);

  const eventDup = new Event('input');
  searchElt.dispatchEvent(eventDup);

  document.removeEventListener('keyup', focusSearchFieldOnKeyUp, false);
};

const resetPage = () => {
  document.addEventListener('keyup', focusSearchFieldOnKeyUp, false);
  updateCheatsheetWithEncoding(data);
};

const resetSearchField = () => {
  searchElt.value = '';
  resetPage();
};

const runResetSearchField = runOnCondition(resetSearchField);

const initPage = () => {
  searchElt.addEventListener('input', updateCheatsheetOnInput, false);
  searchElt.addEventListener('keypress', compose(runResetSearchField, isEscKey), false);
  headerLogoElt.addEventListener('click', compose(runResetSearchField, isClick), false);
  resetPage();
};

initPage();
