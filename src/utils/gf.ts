import { Request } from 'express';
import passport, { use } from 'passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';

const GoogleStrategy = Strategy

passport.use(new GoogleStrategy({
    clientID: "951048738787-96ge4tf6og746472dgp1aj91qdtmg3kv.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "https://api.rise-shopping.uz/auth/google/callback",
    passReqToCallback: true,
},
    function (request: Request, accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
        const { name, emails, photos } = profile
        const user = {
            email: emails[0]?.value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0]?.value,
            accessToken
        }
        done(null, user);
    }));
passport.use(new FacebookStrategy({
    clientID: '290451870381084',
    clientSecret: '5a9d4a241af60d126ea74de1d48f9361',
    callbackURL: 'http://localhost:5000/auth/facebook/callback',
    profileFields: ['id', 'displayName']
},
    function (accessToken: string, refreshToken: string, profile: any, done) {
        // if user exist by id
        // else user ko save krna hai
        // const { name, emails, photos } = profile
        const user = {
            // email: emails[0].value,
            // firstName: name.givenName,
            // lastName: name.familyName,
            // picture: photos[0].value,
            // accessToken
        };
        done(null, user);
    }
))
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

export default passport