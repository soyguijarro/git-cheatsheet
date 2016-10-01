import compose from 'ramda/src/compose';

import { toUpperCase } from './text-transformers';

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

const checkDOMNodeTagName = tagName => node => (
  toUpperCase(node.tagName) === toUpperCase(tagName)
);
const isInputNode = checkDOMNodeTagName('input');
/* eslint-disable no-param-reassign */
export const setDOMNodeValue = node => (value) => {
  const property = isInputNode(node) ? 'value' : 'innerHTML';
  node[property] = value;
};
/* eslint-enable no-param-reassign */

export const addListenerToDOMNode = node => node.addEventListener;

export const removeListenerFromDOMNode = node => node.removeEventListener;

export const setFocusOnDOMNode = node => node.focus();
