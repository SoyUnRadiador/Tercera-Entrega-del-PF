const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const User = require('./models/User'); // Asegúrate de usar la ruta correcta
const userService = require('./models/User');
const config = require('./config/config')

const initializePassport = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userService.findById(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });

    passport.use(new GitHubStrategy({
        //GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET y GITHUB_URL ya no estan expuestas en el codigo
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_URL,
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log('GitHub Profile:', profile); // Log del perfil obtenido de GitHub

            let user = await User.findOne({ email: profile._json.email });

            if (!user) {
                let newUser = {
                    name: profile._json.name,
                    last_Name: '',
                    age: 18,
                    email: profile._json.email,
                    password: 'aaa'
                }
                let result = await User.create(newUser);
                console.log('New User created:', result); // Log del nuevo usuario creado
                done(null, result);
            } else {
                console.log('User found:', user); // Log del usuario encontrado
                done(null, user);
            }
        } catch (error) {
            console.error('Error during GitHub authentication:', error); // Log de errores
            done(error, null);
        }
    }));
};

module.exports = initializePassport;
