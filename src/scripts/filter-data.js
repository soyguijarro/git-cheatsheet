import compose from 'ramda/src/compose';

const testString = regExp => string => regExp.test(string);

const getItemString = item => item.name + item.content;

export default (data, searchString) => {
  const testForSearchString = testString(new RegExp(searchString, 'ig'));
  const testItemForSearchString = compose(testForSearchString, getItemString);

  return data.filter(testItemForSearchString);
};
