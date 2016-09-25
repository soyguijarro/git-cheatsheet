export default dictionary => (string = '') => (
  Object.keys(dictionary).reduce((encodedString, char) => {
    const charRegExp = new RegExp(char, 'g');
    return encodedString.replace(charRegExp, dictionary[char]);
  }, string)
);
