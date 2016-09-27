import compose from 'ramda/src/compose';

import { createDOMNode } from './utils/dom-node-helpers';
import { wrapTextWithClass } from './utils/text-transformers';

import { CLASSNAMES, TEXTS } from './constants';

// Auxiliary functions
const createSectionElt = createDOMNode('section');
const createDivElt = createDOMNode('div');

const getNoResultsElt = () => createSectionElt({
  className: CLASSNAMES.NO_RESULTS,
  innerHTML: TEXTS.NO_RESULTS,
});

const getResultSectionEltInnerHTML = (id, text) => (`
  <h2 class=${CLASSNAMES.SECTION_TITLE}>
    <a href="#${id}">${text}</a>
  </h2>
`);
const getResultSectionElt = (id, text) => createSectionElt({
  id,
  className: CLASSNAMES.SECTION,
  innerHTML: getResultSectionEltInnerHTML(id, text),
});

const getResultItemEltClassName = isEndOfSubsection => (
  `${CLASSNAMES.ITEM} ${isEndOfSubsection ? CLASSNAMES.ITEM_SPACE : ''}`
);
const getResultItemEltInnerHTML = textFormatter => (name, content) => (`
  <span class=${CLASSNAMES.ITEM_TITLE}>${textFormatter(name)}</span>
  <pre class=${CLASSNAMES.ITEM_CONTENT}>${textFormatter(content)}</pre>
`);
const getResultItemElt = (searchString, encodeText) => ({ name, content, isEndOfSubsection }) => {
  const highlightText = wrapTextWithClass(CLASSNAMES.HIGHLIGHT);
  const highlightSearchString = compose(highlightText, encodeText)(searchString);
  const getResultItemEltFormattedInnerHTML =
    getResultItemEltInnerHTML(compose(highlightSearchString, encodeText));

  return createDivElt({
    className: getResultItemEltClassName(isEndOfSubsection),
    innerHTML: getResultItemEltFormattedInnerHTML(name, content),
  });
};

const convertToLowerCase = string => string.toLowerCase();
const replaceSpacesWithHyphens = string => string.replace(/ /g, '-');
const getResultSectionEltId = compose(convertToLowerCase, replaceSpacesWithHyphens);
export default encodeText => (items, searchString) => {
  const mainElt = document.querySelector(`.${CLASSNAMES.MAIN}`);
  mainElt.innerHTML = '';

  if (!items || !items.length) {
    mainElt.appendChild(getNoResultsElt());
    return;
  }

  const getFormattedResultItemElt = getResultItemElt(searchString, encodeText);
  items.forEach((item) => {
    const sectionId = getResultSectionEltId(item.section);
    let sectionElt = document.querySelector(`#${sectionId}`);

    if (!sectionElt) {
      sectionElt = getResultSectionElt(sectionId, item.section);
      mainElt.appendChild(sectionElt);
    }

    sectionElt.appendChild(getFormattedResultItemElt(item));
  });
};
