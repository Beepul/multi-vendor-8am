const allowRole = (allowedRole) => {
    return (req, res, next) => {
        try {
            const loggedInUser = req.authUser || null
            const userRole = loggedInUser.role

            if(typeof allowedRole === 'string' && allowedRole === userRole) {
                next()
            }else if(Array.isArray(allowedRole) && allowedRole.includes(userRole)){
                next()
            } else {
                next({code: 403, message: "You are not authorized to access this resource!"})
            }
        } catch (error) {
            next(error);
        }
    }
}

module.exports = allowRole