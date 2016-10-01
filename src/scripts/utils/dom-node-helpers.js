import compose from 'ramda/src/compose';
import reduce from 'ramda/src/reduce';

import { toUpperCase } from './text-transformers';

export const getDOMNode = (query, root = document) => root.querySelector(query);

const createNewDOMNode = document.createElement.bind(document);
const addAttributesToDOMNode = attributes => (node) => {
  /* eslint-disable no-param-reassign */
  const addAttribute = (modifiedNode, attribute) => {
    modifiedNode[attribute] = attributes[attribute];
    return modifiedNode;
  };
  /* eslint-enable no-param-reassign */

  return reduce(addAttribute, node, Object.keys(attributes));
};
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

export const appendChildToDOMNode = node => child => node.appendChild(child);

export const setFocusOnDOMNode = node => node.focus();

export const addListenerToDOMNode = node => node.addEventListener;

export const removeListenerFromDOMNode = node => node.removeEventListener;
