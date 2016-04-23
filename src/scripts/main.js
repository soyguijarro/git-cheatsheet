import escapeStringRegexp from 'escape-string-regexp';
import updateCheatsheet from './update-cheatsheet';
import encodeLessGreaterThanSigns from './encode-less-greater-than-signs';
import data from '../data.json';
import '../styles/main.scss';

if (module.hot) module.hot.accept();

const searchElt = document.querySelector('.header-search');
const headerLogoElt = document.querySelector('.header-logo');

const updateCheatsheetOnInput = event => {
  if (!event) return updateCheatsheet(data);

  const searchString = escapeStringRegexp(event.target.value);
  const searchRegExp = new RegExp(searchString, 'ig');

  const filteredData = data.filter(item =>
    item.name.search(searchRegExp) !== -1 || item.content.search(searchRegExp) !== -1
  );

  return updateCheatsheet(filteredData, encodeLessGreaterThanSigns(searchString));
};

const focusSearchFieldOnKeyUp = event => {
  const pressedKey = event.key || String.fromCharCode(event.keyCode).toLowerCase();

  if (!/^[a-z]$/i.test(pressedKey) || event.altKey || event.ctrlKey || event.metaKey) return;

  searchElt.value = pressedKey;
  searchElt.focus();

  const eventDup = new Event('input');
  searchElt.dispatchEvent(eventDup);

  document.removeEventListener('keyup', focusSearchFieldOnKeyUp, false);
};

const activateTypeToSearch = () => {
  document.addEventListener('keyup', focusSearchFieldOnKeyUp, false);
};

const initializePage = () => {
  activateTypeToSearch();
  updateCheatsheetOnInput();
};

const resetSearchField = event => {
  if (event.key && event.key !== 'Escape' || event.keyCode && event.keyCode !== 27) return;
  console.log('Reset');

  searchElt.value = '';
  initializePage();
};

searchElt.addEventListener('input', updateCheatsheetOnInput, false);
document.addEventListener('keypress', resetSearchField, false);
headerLogoElt.addEventListener('click', resetSearchField, false);

initializePage();
