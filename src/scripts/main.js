import '../styles/main.scss';
import data from '../data.json';

if (module.hot) module.hot.accept();

const searchElt = document.querySelector('.header-search');
const headerLogoElt = document.querySelector('.header-logo');

const updatePageOnSearch = event => {
  const updatePage = (filteredData, searchString) => {
    const searchRegExp = new RegExp(searchString, 'ig');
    const mainElt = document.querySelector('.main');
    mainElt.innerHTML = '';

    if (!(filteredData && filteredData.length > 0)) {
      const noResultsElt = document.createElement('section');
      noResultsElt.className = 'main-section-no-results';
      noResultsElt.innerHTML = `There are no matches for <strong>${searchString}</strong>.`;
      mainElt.appendChild(noResultsElt);
    }

    const addHighlight = (string) => (
      string.replace(searchRegExp, '<span class="main-section-highlight">$&</span>')
    );
    filteredData.forEach(item => {
      const sectionId = item.section.toLowerCase().replace(/ /g, '-');
      let sectionElt = document.getElementById(sectionId);

      if (!sectionElt) {
        sectionElt = document.createElement('section');
        sectionElt.className = 'main-section';
        sectionElt.id = sectionId;
        sectionElt.innerHTML =
          `<h2 class="main-section-title">
            <a href="#${sectionId}">
              ${item.section}
            </a>
          </h2>`;

        mainElt.appendChild(sectionElt);
      }

      const itemElt = document.createElement('div');
      itemElt.className = `main-section-item ${item.isEndOfSubsection ?
        'main-section-extra-space' : ''}`;
      itemElt.innerHTML =
        `<span class="main-section-item-title">
          ${addHighlight(item.name)}
        </span>
        <pre class="main-section-item-content">
          ${addHighlight(item.content)}
        </pre>`;

      sectionElt.appendChild(itemElt);
    });
  };

  if (!event) return updatePage(data);

  const searchString = event.target.value;
  const searchRegExp = new RegExp(searchString, 'ig');

  const filteredData = data.filter(item => (
    item.name.search(searchRegExp) !== -1 || item.content.search(searchRegExp) !== -1
  ));

  return updatePage(filteredData, searchString);
};

const focusSearchFieldOnKeyPress = event => {
  const pressedKey = event.key || String.fromCharCode(event.keyCode).toLowerCase();

  if (!/^[a-z]$/i.test(pressedKey) || event.altKey || event.ctrlKey || event.metaKey) return;

  searchElt.value = pressedKey;
  searchElt.focus();

  const eventDup = new Event('input');
  searchElt.dispatchEvent(eventDup);

  document.removeEventListener('keyup', focusSearchFieldOnKeyPress, false);
};

const activateTypeToSearch = () => {
  document.addEventListener('keyup', focusSearchFieldOnKeyPress, false);
};

const initializePage = () => {
  activateTypeToSearch();
  updatePageOnSearch();
};

const resetSearchField = () => {
  searchElt.value = '';
  initializePage();
};

searchElt.addEventListener('input', updatePageOnSearch, false);
headerLogoElt.addEventListener('click', resetSearchField, false);

initializePage();
