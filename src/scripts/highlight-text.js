const highlightText = (targetString, textToHighlight) => {
  if (!(textToHighlight && textToHighlight.length > 0)) return targetString;

  const highlightRegExp = new RegExp(textToHighlight, 'ig');
  return targetString.replace(highlightRegExp, '<span class="main-section-highlight">$&</span>');
};

export default highlightText;
