import escapeStringRegexp from 'escape-string-regexp';
import compose from 'ramda/src/compose';

import encodeText from './utils/encode-text';
import checkPressedKey from './utils/check-pressed-key';
import checkEventType from './utils/check-event-type';
import runOnCondition from './utils/run-on-condition';

import updateCheatsheet from './update-cheatsheet';

import { ANGLE_BRACKETS_CHAR_ENTITIES, CLASSNAMES, ESC_KEY } from './constants';
import data from '../data.json';
import '../styles/main.scss';

if (module.hot) module.hot.accept();

const encodeAngleBrackets = encodeText(ANGLE_BRACKETS_CHAR_ENTITIES);
const updateCheatsheetWithEncoding = updateCheatsheet(encodeAngleBrackets);

const searchElt = document.querySelector(`.${CLASSNAMES.SEARCH}`);
const headerLogoElt = document.querySelector(`.${CLASSNAMES.LOGO}`);

const updateCheatsheetOnInput = (event) => {
  const searchString = escapeStringRegexp(event.target.value);
  const searchRegExp = new RegExp(searchString, 'ig');
  const filteredData = data.filter(item => searchRegExp.test(item.name + item.content));

  return updateCheatsheetWithEncoding(filteredData, searchString);
};

const focusSearchFieldOnKeyUp = (event) => {
  const pressedKey = event.key || String.fromCharCode(event.keyCode).toLowerCase();

  if (!/^[a-z]$/i.test(pressedKey) || event.altKey || event.ctrlKey || event.metaKey) return;

  searchElt.focus();
  searchElt.value = pressedKey;

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
const isEscKeyEvent = checkPressedKey({ name: ESC_KEY.NAME, code: ESC_KEY.CODE });
const isClickEvent = checkEventType('click');
const initPage = () => {
  searchElt.addEventListener('input', updateCheatsheetOnInput, false);
  searchElt.addEventListener('keypress', compose(runResetSearchField, isEscKeyEvent), false);
  headerLogoElt.addEventListener('click', compose(runResetSearchField, isClickEvent), false);
  resetPage();
};

initPage();
