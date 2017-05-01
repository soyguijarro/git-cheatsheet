import compose from 'ramda/src/compose';
import filter from 'ramda/src/filter';

const testString = refString => string => new RegExp(refString, 'ig').test(string);

const getItemString = item => item.name + item.content;

export default (data, searchString) =>
  filter(compose(testString(searchString), getItemString), data);
