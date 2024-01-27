import { Request } from 'express';
import passport, { use } from 'passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

const GoogleStrategy = Strategy

const Google_Sectret='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';
const Google_Id='951048738787-96ge4tf6og746472dgp1aj91qdtmg3kv.apps.googleusercontent.com'
const Google_Url='https://api.rise-shopping.uz/auth/google/callback'
// const Google_Sectret='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';
// const Google_Id='427372573880-fj4t7q9fsippo5tm39a72fqqgu77fvtl.apps.googleusercontent.com'
// const Google_Url='http://localhost:5000/auth/google/callback'
passport.use(new GoogleStrategy({
    clientID: Google_Id,
    clientSecret: Google_Sectret,
    callbackURL: Google_Url,
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
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

export default passport