import escapeStringRegexp from 'escape-string-regexp';
import encodeText from './utils/encode-text';
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

const resetSearchField = (event) => {
  const isClickEvent = event.type === 'click';
  const isEscKeyEvent = event.key === ESC_KEY.NAME || event.keyCode === ESC_KEY.CODE;
  if (!isClickEvent && !isEscKeyEvent) return;

  searchElt.value = '';
  resetPage();
};

searchElt.addEventListener('input', updateCheatsheetOnInput, false);
searchElt.addEventListener('keypress', resetSearchField, false);
headerLogoElt.addEventListener('click', resetSearchField, false);
resetPage();
