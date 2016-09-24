import encodeLessGreaterThanSigns from './encode-less-greater-than-signs';
import highlightText from './highlight-text';

const updateCheatsheet = (data, searchString) => {
  const mainElt = document.querySelector('.main');
  mainElt.innerHTML = '';

  if (!(data && data.length > 0)) {
    const noResultsElt = document.createElement('section');

    noResultsElt.className = 'main-section-no-results';
    noResultsElt.innerHTML = 'There are no results.';
    mainElt.appendChild(noResultsElt);

    return;
  }

  data.forEach((item) => {
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
        ${highlightText(encodeLessGreaterThanSigns(item.name), searchString)}
      </span>
      <pre class="main-section-item-content">
        ${highlightText(encodeLessGreaterThanSigns(item.content), searchString)}
      </pre>`;

    sectionElt.appendChild(itemElt);
  });
};

export default updateCheatsheet;
