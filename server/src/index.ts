import express from 'express';
import cors from 'cors';
const app = express();
require("dotenv").config(); // required to read from .env file
const port = 3030;

// automatically convert requests to json
app.use(express.json());
// can specify what services can use this server by doing for example: cors(http://localhost:5174/)
app.use(cors());

app.get("/", (req, res) => {
  res.send("hi");
});


// port to listen on
// second argument is optional but just a nice confirmation
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  console.log(`http://localhost:${port}/`);
});