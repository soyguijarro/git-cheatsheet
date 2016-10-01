import escapeStringRegexp from 'escape-string-regexp';

export const replaceText = replacement => text => (target) => {
  const textRegExp = new RegExp(text, 'ig');
  return target.replace(textRegExp, replacement);
};

const replaceTextWithSpan = className => replaceText(`<span class=${className}>$&</span>`);
export const wrapTextWithClass = className => text => (targetString) => {
  if (!text || !text.length) return targetString;

  const wrapWithClass = replaceTextWithSpan(className);
  return wrapWithClass(text)(targetString);
};

export const encodeText = dictionary => (string = '') => (
  Object.keys(dictionary).reduce((encodedString, char) => (
    replaceText(dictionary[char])(char)(encodedString)
  ), string)
);

export const escapeRegExpSpecialChars = escapeStringRegexp;

export const toUpperCase = string => string.toUpperCase();

export const toLowerCase = string => string.toLowerCase();
