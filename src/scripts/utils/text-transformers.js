import escapeStringRegexp from 'escape-string-regexp';
import reduce from 'ramda/src/reduce';

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

export const encodeText = dictionary => (string = '') => {
  const encodeChar = (encodedString, char) => replaceText(dictionary[char])(char)(encodedString);
  return reduce(encodeChar, string, Object.keys(dictionary));
};

export const escapeRegExpSpecialChars = escapeStringRegexp;

export const toUpperCase = string => string.toUpperCase();

export const toLowerCase = string => string.toLowerCase();
