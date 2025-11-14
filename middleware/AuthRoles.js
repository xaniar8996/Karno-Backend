
const Authpage = (...permissions) => {
    return (req, res, next) => {
        if (!req?.roles) return res.sendStatus(401)
        const RolesArray = [...permissions]
        
        // Extract role values from object or array
        let userRoles = [];
        if (Array.isArray(req.roles)) {
            userRoles = req.roles;
        } else if (typeof req.roles === 'object' && req.roles !== null) {
            // Extract values from roles object (e.g., {User: 2001, Admin: 5051} -> [2001, 5051])
            userRoles = Object.values(req.roles).filter(val => val != null);
        } else {
            userRoles = [req.roles];
        }
        
        const hasPermission = userRoles.some(role => RolesArray.includes(role));

        if (!hasPermission) return res.sendStatus(403);
        next();
    }
};

module.exports = Authpage