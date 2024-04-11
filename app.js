import express from 'express';
import mountRoutes from './routes/index.js';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", express.static("public"));
app.use("/item", express.static("public"));

mountRoutes(app);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
})