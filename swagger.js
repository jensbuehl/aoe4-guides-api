import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  swaggerDefinition: {
    openapi: '3.1.0',
    info: {
      title: 'aoe4guides API',
      version: '1.0.0',
      description: 'REST API to access build orders from aoe4guides.com',
    },
    servers: [
      {
        url: 'https://aoe4guides.com/api',
      },
    ],
  },
  apis: ['./index.js', './*.js'],
}

const specs = swaggerJsdoc(options)


export default (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
}