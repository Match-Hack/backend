import app from "./app"; 
const port = 8080;

app.listen(port,() => {
  /* eslint-disable no-console */
  console.log(`Listening: ${port}`);
  /* eslint-enable no-console */
});