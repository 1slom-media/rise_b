import cors from 'cors';
import express, { Application } from 'express';
import session from 'express-session';
import passport from './utils/gf';
import { AppDataSource } from './data-source';
import router from './routes';

const app: Application = express();

const PORT = process.env.PORT || 3000

app.use(express.json());
app.use(cors());
app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
AppDataSource.initialize().then((): void => console.log("connected")).catch((err: unknown): void => console.log(err));
app.use(router);
app.get('/', (req, res) => {
    res.send('<a href="/auth/google">Authenticate with Google</a>,<a href="/auth/facebook">Authenticate with Facebook</a>');
});

app.listen(PORT, (): void => console.log(`http://localhost:${PORT}`));

