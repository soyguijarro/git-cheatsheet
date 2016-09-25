import escapeStringRegexp from 'escape-string-regexp';

const replaceText = replacement => (target, text) => {
  const textRegExp = new RegExp(text, 'ig');
  return target.replace(textRegExp, replacement);
};

const replaceTextWithSpan = className => replaceText(`<span class=${className}>$&</span>`);
export const wrapTextWithClass = className => text => (targetString) => {
  if (!text || !text.length) return targetString;

  const wrapWithClass = replaceTextWithSpan(className);
  return wrapWithClass(targetString, text);
};

export const encodeText = dictionary => (string = '') => (
  Object.keys(dictionary).reduce((encodedString, char) => (
    replaceText(dictionary[char])(encodedString, char)
  ), string)
);

export const escapeRegExpSpecialChars = escapeStringRegexp;
