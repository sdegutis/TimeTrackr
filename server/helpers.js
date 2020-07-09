const jwt = require('jsonwebtoken');

/**
 * @param {number} requiredLevel
 * @returns {import('express').Handler}
 */
exports.requireAuthLevel = (requiredLevel) => {
  return (req, res, next) => {
    const auth = req.headers['authorization'];
    if (!auth) return res.sendStatus(401);

    const authMatch = auth.match(/Bearer (.+)/);
    if (!authMatch) return res.sendStatus(401);

    const [, token] = authMatch;

    let tokenData;
    try { tokenData = jwt.verify(token, process.env.JWT_SECRET); }
    catch (e) { return res.sendStatus(401); }

    if (tokenData.authLevel < requiredLevel) {
      return res.sendStatus(403);
    }

    req.auth = tokenData;
    return next();

  };
};

/**
 * @param {(req: import('express').Request) => Promise<[number, any]>} fn
 * @returns {import('express').Handler}
 */
exports.asyncHandler = (fn) => {
  return (req, res, next) => {
    try {
      fn(req).then(([code, json]) => {
        res.status(code).json(json);
        next();
      });
    }
    catch (e) {
      next(e);
    }
  };
};
