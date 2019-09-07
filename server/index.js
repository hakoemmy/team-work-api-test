import express from 'express';
import bodyParse from 'body-parser';
import dotenv from 'dotenv';
import swaggerUI from 'swagger-ui-express';
import config from './config/default';
import userRoute from './routes/userRoute';
import articleRoute from './routes/articleRoute';
import StatusCode from './helpers/statusCode';
import isContentTypeValid from './middleware/isContentTypeValid';
import isValidJson from './middleware/isValidJson';
import swaggerDoc from '../app.json';

dotenv.config();

const app = express();
app.use(bodyParse.json());
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));
app.use('/api/v1', isValidJson, articleRoute);
app.use('/api/v1/auth', isContentTypeValid, isValidJson, userRoute);
// Default response when no valid endpoint Uri found
// on our server

app.use('/', (req, res) => {
  res.status(StatusCode.NOT_FOUND).send({
    status: StatusCode.NOT_FOUND,
    message: 'Welcome to TeamWork API!',
  });
});

const { port } = config;
console.log(`Secret key ${process.env.JWTSECRET}`);
app.listen(port, () => console.log(`Listening on port ${port}...`));
export default app;
