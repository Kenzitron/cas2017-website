/**
 * Login Form
 * @param req
 * @param res
 * @param next
 */
exports.ensureIsAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/login')
};
