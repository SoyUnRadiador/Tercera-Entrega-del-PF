const authorizationMiddleware = (role) => {
    return (req, res, next) => {
        // Verifica que el token esté presente en las cabeceras de la solicitud
        const token = req.headers.authorization;

        console.log('Token:', token); 

        // Verificar si el usuario tiene el rol necesario
        if (req.user && req.user.role === role) {
            next(); // Permitir el acceso
        } else {
            res.status(403).json({ message: 'Acceso no autorizado' });
        }
    };
};

module.exports = authorizationMiddleware;
