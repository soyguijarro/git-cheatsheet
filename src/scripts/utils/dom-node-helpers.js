import compose from 'ramda/src/compose';

const createNewDOMNode = document.createElement.bind(document);
const addAttributesToDOMNode = attributes => node => (
  Object.keys(attributes).reduce((nodeWithAttrs, attrName) => {
    const currentNode = nodeWithAttrs;
    currentNode[attrName] = attributes[attrName];
    return nodeWithAttrs;
  }, node)
);
export const createDOMNode = type => (attributes) => {
  const addAttributes = addAttributesToDOMNode(attributes);
  return compose(addAttributes, createNewDOMNode)(type);
};

export const addListenerToDOMNode = node => (event, listener) => {
  node.addEventListener(event, listener, false);
};

export const setFocusOnDOMNode = node => node.focus();

export const setDOMNodeValue = node => (value) => {
  /* eslint-disable no-param-reassign */
  node.value = value;
  /* eslint-enable no-param-reassign */
};
