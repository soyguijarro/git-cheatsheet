const replaceText = replacement => (text, target) => {
  const textRegExp = new RegExp(text, 'ig');
  return target.replace(textRegExp, replacement);
};

const replaceTextWithSpan = className => replaceText(`<span class=${className}>$&</span>`);

export default className => text => (targetString) => {
  if (!text || !text.length) return targetString;

  const wrapTextWithClass = replaceTextWithSpan(className);
  return wrapTextWithClass(text, targetString);
};
