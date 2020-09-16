module.exports = {
    isLoggedIn(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        return res.json({code: 200, success: 'Must be logged'});
    },
    isNotLoggedIn(req, res, next){
        if(!req.isAuthenticated()){
            return next();
        }
        return res.json({code: 200, success: 'Already Logged'});
    }
};