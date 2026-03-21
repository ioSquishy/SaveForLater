import { app } from "./app";
const port = 3030;

// port to listen on
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  console.log(`http://localhost:${port}/`);
});