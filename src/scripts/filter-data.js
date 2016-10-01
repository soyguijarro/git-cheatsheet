import compose from 'ramda/src/compose';
import filter from 'ramda/src/filter';

const testString = regExp => string => regExp.test(string);

const getItemString = item => item.name + item.content;

export default (data, searchString) => {
  const testForSearchString = testString(new RegExp(searchString, 'ig'));

  return filter(compose(testForSearchString, getItemString), data);
};
