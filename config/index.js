const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  envPort: process.env.PORT,
  accessTokenKey: process.env.ACCESS_TOKEN_KEY,
};
