const index = (req, res, next) => {
  res.json({
    message: "Hello World 1",
  });
};

module.exports = { index };
