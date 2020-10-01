const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const createToken = (user) => {
  if (!user.role) {
    throw new Error("No user role specified");
  }
  return jwt.sign(
    {
      sub: user._id,
      username: user.username,
      role: user.role,
    },
    process.env.SECRET,
    {
      algorithm: "HS256",
      expiresIn: "12h",
    },
  );
};

const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (error, salt) => {
      if (error) {
        reject(error);
      }
      bcrypt.hash(password, salt, (error, hash) => {
        if (error) {
          reject(error);
        }
        resolve(hash);
      });
    });
  });
};

const verifyPassword = (passwordAttempt, hashedPassword) => {
  return bcrypt.compare(passwordAttempt, hashedPassword);
};

const requireAdmin = (request, response, next) => {
  if (!request.user) {
    return response.status(401).json({
      message: "There was a problem authorizing the request",
    });
  }
  if (request.user.role !== "admin") {
    return response.status(401).json({ message: "Insufficient role" });
  }
  next();
};

module.exports = {
  createToken,
  hashPassword,
  verifyPassword,
  requireAdmin,
};
