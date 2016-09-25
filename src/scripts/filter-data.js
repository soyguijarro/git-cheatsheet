import compose from 'ramda/src/compose';

const testString = regExp => string => regExp.test(string);

const getItemString = item => item.name + item.content;

export default (data, searchString) => {
  const searchRegExp = new RegExp(searchString, 'ig');
  const testForSearchString = testString(searchRegExp);
  const testItemForSearchString = compose(testForSearchString, getItemString);

  return data.filter(testItemForSearchString);
};
