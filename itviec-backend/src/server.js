import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';
import errorHandler from './shared/middlewares/errorHandler.middeware.js';
import notFoundHandler from './shared/middlewares/notFoundHandler.middleware.js';
import v1Routes from './routes/v1/index.js';

const app = express();

// 1. Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 2. Middleware xử lý CORS và phân tích JSON parsing
app.use(cors());
app.use(express.json());

// 3. Định tuyến API version v1
app.use('/api/v1', v1Routes);

// 4. Middleware xử lý 404 - Not Found
app.use('/*path', notFoundHandler);

// 5. Middleware xử lý lỗi
app.use(errorHandler);

export default app;