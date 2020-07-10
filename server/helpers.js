const jwt = require('jsonwebtoken');

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

/**
 * @param {number} requiredLevel
 * @returns {import('express').Handler}
 */
exports.requireAuthLevel = (requiredLevel) => {
  return (req, res, next) => {
    // Always prefer Bearer
    const token = tokenFromBearer(req) || req.cookies.jwt;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    /** @type {{authLevel: number}} */
    let tokenData;
    try { tokenData = /** @type{*} */(jwt.verify(token, process.env.JWT_SECRET)); }
    catch (e) { return res.status(401).json({ error: "Unauthorized" }); }

    if (tokenData.authLevel < requiredLevel) {
      return res.status(403).json({ error: "Forbidden" });
    }

    req.body._auth = tokenData;
    return next();
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
