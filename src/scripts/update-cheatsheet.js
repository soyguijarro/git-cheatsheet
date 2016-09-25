import compose from 'ramda/src/compose';
import createDOMNode from './utils/create-dom-node';
import wrapTextWithClass from './utils/wrap-text-with-class';
import { CLASSNAMES, TEXTS } from './constants';

const createSectionElt = createDOMNode('section');
const createDivElt = createDOMNode('div');

const getNoResultsElt = () => createSectionElt({
  className: CLASSNAMES.NO_RESULTS,
  innerHTML: TEXTS.NO_RESULTS,
});

const getResultSectionElt = (id, text) => createSectionElt({
  id,
  className: CLASSNAMES.SECTION,
  innerHTML:
    `<h2 class=${CLASSNAMES.SECTION_TITLE}>
      <a href="#${id}">
        ${text}
      </a>
    </h2>`,
});

const getResultItemElt = (searchString, encodeText) => ({ name, content, isEndOfSubsection }) => {
  const highlightText = wrapTextWithClass(CLASSNAMES.HIGHLIGHT);
  const highlightSearchString = highlightText(encodeText(searchString));
  const formatText = compose(highlightSearchString, encodeText);

  return createDivElt({
    className: `${CLASSNAMES.ITEM} ${isEndOfSubsection ? CLASSNAMES.ITEM_SPACE : ''}`,
    innerHTML:
      `<span class=${CLASSNAMES.ITEM_TITLE}>
        ${formatText(name)}
      </span>
      <pre class=${CLASSNAMES.ITEM_CONTENT}>
        ${formatText(content)}
      </pre>`,
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
