const getKeyName = (event) => {
  const { key, keyCode } = event;
  return key || String.fromCharCode(keyCode).toLowerCase();
};

export default keyName => (event) => {
  const pressedKeyName = getKeyName(event);

  if (keyName instanceof RegExp) return keyName.test(pressedKeyName);
  return pressedKeyName === keyName;
};
