const { createApp } = require('./app');
const config = require('./config/config');

const app = createApp();

app.listen(config.app.port, () => {
  console.log(`Server listening on port ${config.app.port}`);
});
