import { compose } from 'ramda';

const createNewNode = document.createElement.bind(document);

const addAttributesToNode = attributes => node => (
  Object.keys(attributes).reduce((nodeWithAttrs, attrName) => {
    const currentNode = nodeWithAttrs;
    currentNode[attrName] = attributes[attrName];
    return nodeWithAttrs;
  }, node)
);

export default type => (attributes) => {
  const addAttributes = addAttributesToNode(attributes);
  return compose(addAttributes, createNewNode)(type);
};
