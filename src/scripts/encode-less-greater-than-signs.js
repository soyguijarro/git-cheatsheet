const encodeLessGreaterThanSigns = string => (
  string.replace(/</g, '&#60;').replace(/>/g, '&#62;')
);

export default encodeLessGreaterThanSigns;
