const normalizePhone = (value) => {
  return value.replace(/[^\d]/g, "");
};

export default normalizePhone;
