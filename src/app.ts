import express from 'express';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import connectToDb from './configs/db.js';
import adminRouter from './modules/admin/admin.route.js';
import { Request, Response, NextFunction } from 'express';
import { error } from 'console';
// import botRouter from './modules/bot/bot.route.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', 'views');

connectToDb();

app.use('/', adminRouter);
// app.use('/webhook', botRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(`Internal Server Error: ${err.message} \n`);
  res.status(500).json({ success: false, message: err.message });
});

export default app;
