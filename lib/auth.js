module.exports = {
    isLoggedIn(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        return res.json({code: 403, success: 'Must be logged'});
    },
    isNotLoggedIn(req, res, next){
        if(!req.isAuthenticated()){
            return next();
        }
        return res.json({code: 403, success: 'Already Logged'});
    }
};