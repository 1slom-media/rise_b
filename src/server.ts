import cors from 'cors';
import express, { Application } from 'express';
import session from 'express-session';
import passport from './utils/gf';
import { AppDataSource } from './data-source';
import router from './routes';
import path from 'path';

const app: Application = express();

const PORT = process.env.PORT || 5000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
AppDataSource.initialize().then((): void => console.log("connected")).catch((err: unknown): void => console.log(err));
app.use('/static', express.static(path.join(process.cwd(), 'uploads')))
app.use(router);

app.listen(PORT, (): void => console.log(`http://localhost:${PORT}`));

