const slug = (name) => {
  return name.replace(/\s+/g, "-").toLowerCase();
};

module.exports = slug;
