import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = 8000; //|| process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
