import express from 'express';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import connectToDb from './configs/db.config.js';
import adminRouter from './modules/admin/admin.routes.js';
import botRouter from './modules/bot/bot.route.js';
import visualizerRouter from './modules/visualizer/visualizer.routes.js';
import broadcastAdminRouter from "./modules/broadcastAdmin/broadcast.routes.js"
import { Request, Response, NextFunction } from 'express';
import { initIDX } from './configs/script.js';

const app = express(); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', 'views');

connectToDb();
initIDX();

app.use('/', adminRouter);
app.use('/webhook', botRouter);
app.use('/public-stats', visualizerRouter);
app.use('/admin-broadcast', broadcastAdminRouter);

// import { sendWhatsAppMessage } from './utils/botFunctions.js';
// await sendWhatsAppMessage("whatsapp:+2347042274824", "HELLO FROM NODEJ")
  
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(`Internal Server Error: ${err.message} \n ${err.cause} \n ${err.stack}`);
  res.status(500).json({ success: false, message: err.message }); 
});

export default app;
 