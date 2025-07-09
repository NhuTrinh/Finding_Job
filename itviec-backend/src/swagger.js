// swagger.js
import swaggerJSDoc from 'swagger-jsdoc';
import dotenv from 'dotenv';

dotenv.config();

const hostUrl = process.env.RENDER_EXTERNAL_URL || 'http://localhost:8000/api/v1';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express CRUD API',
      version: '1.0.0',
      description: 'A simple CRUD API with ExpressJS and Swagger',
    },
    servers: [
      {
        url: hostUrl,
      },
    ],
  },
  apis: ['./src/api/**/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
