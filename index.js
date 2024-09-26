const express = require('express');
const path = require('path');
const cors = require('cors')
const createError = require('http-errors');
const formData = require('express-form-data')

const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());
// app.use(formData.parse());
app.use(express.static(path.join(__dirname, 'image')));

const userRouter = require('./router/user.router')
app.use("/user", userRouter)
const mejaRouter = require('./router/meja.router')
app.use("/meja", mejaRouter)
const menuRouter = require('./router/menu.router')
app.use("/menu", menuRouter)
const transaksiRouter = require('./router/transaksi.router')
app.use("/transaksi", transaksiRouter)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });