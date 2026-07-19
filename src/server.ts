import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { errorMiddleware } from './middlewares/error.middleware';
import { routes } from './routes/index';

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', routes);

app.get('/', (_req, res) => {
  res.json({
    message: 'API de Servicio Tecnico de Celulares',
    version: '1.0.0',
    status: 'online',
  });
});

app.use(errorMiddleware);

app.listen(env.PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${env.PORT}`);
  console.log(`API base URL: http://localhost:${env.PORT}/api/v1`);
});

export default app;
