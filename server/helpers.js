const jwt = require('jsonwebtoken');
const { AUTH, User } = require('./model/user');

exports.maybeDate = function (date) {
  if (typeof date !== 'string') return null;
  const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
  return date.match(DATE_REGEX) ? date : null;
}

/**
 * @param {import('express').Request} req
 */
function tokenFromBearer(req) {
  const auth = req.headers['authorization'];
  if (!auth) return null;

  const authMatch = auth.match(/Bearer (.+)/);
  if (!authMatch) return null;

  const [, token] = authMatch;
  return token;
}

const tokenWhitelist = {};

exports.allowToken = (token) => {
  tokenWhitelist[token] = true;
}

const isWhitelisted = (token) => {
  return true;
  // return tokenWhitelist[token];
}

/**
 * @param {number} requiredLevel
 * @returns {import('express').Handler}
 */
exports.requireAuthLevel = (requiredLevel) => {
  return (req, res, next) => {
    // Always prefer Bearer
    const token = tokenFromBearer(req) || req.cookies.jwt;
    if (!token || !isWhitelisted(token)) return res.status(401).json({ error: "Unauthorized" });

    /** @type {{id: number}} */
    let tokenData;
    try { tokenData = /** @type{*} */(jwt.verify(token, process.env.JWT_SECRET)); }
    catch (e) { return res.status(401).json({ error: "Unauthorized" }); }

    if (requiredLevel > AUTH.USER) {
      User.findById(tokenData.id).then(user => {
        if (user.authLevel < requiredLevel) {
          return res.status(403).json({ error: "Forbidden" });
        }
        else {
          req.body._auth = {
            id: user.id,
            authLevel: user.authLevel,
          };
          return next();
        }
      });
    }
    else {
      req.body._auth = tokenData;
      return next();
    }
  };
};

/**
 * @param {AsyncHandler} fn
 * @returns {import('express').Handler}
 */
exports.asyncHandler = (fn) => {
  return (req, res, next) => {
    try {
      fn(req, res).then(([code, json]) => {
        res.status(code).json(json);
        next();
      });
    }
    catch (e) {
      next(e);
    }
  };
};

/**
 * @callback AsyncHandler
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<[number, object]>}
 */
