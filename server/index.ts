import {App} from './server';

const app = new App();
if (process.env.NODE_ENV === 'production') {
  app.startServer(443);
} else {
  app.startServer(4000);
}
