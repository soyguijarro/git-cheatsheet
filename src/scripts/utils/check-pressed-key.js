export default ({ name, code }) => event => (
  event.key === name || event.keyCode === code
);
