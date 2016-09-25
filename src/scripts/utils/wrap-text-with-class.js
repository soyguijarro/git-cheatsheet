const replaceText = replacement => (text, target) => {
  const textRegExp = new RegExp(text, 'ig');
  return target.replace(textRegExp, replacement);
};

const replaceTextWithSpan = className => replaceText(`<span class=${className}>$&</span>`);

export default (textToWrap, wrapperClase) => (targetString) => {
  if (!textToWrap || !textToWrap.length) return targetString;

  const wrapTextWithClass = replaceTextWithSpan(wrapperClase);
  return wrapTextWithClass(textToWrap, targetString);
};
