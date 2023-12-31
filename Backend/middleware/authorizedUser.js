const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const authorizedUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    // check if token exists
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Unauthorized no token" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
  }

  const { username: urlUsername } = req.params;
  console.log(urlUsername, decoded.username);

  if (urlUsername !== decoded.username) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
  }

  // if the user is authorized, call the next function (updateUser)

  next();
};

module.exports = authorizedUser;
