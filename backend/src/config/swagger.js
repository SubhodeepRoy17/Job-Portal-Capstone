const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Job Portal API',
      version: '1.0.0',
      description: 'Job Portal API Documentation',
      contact: {
        name: 'API Support',
        email: 'support@jobportal.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://jobportal-api.example.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            _id: {
              type: 'string',
              description: 'User ID'
            },
            name: {
              type: 'string',
              description: 'User full name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            role: {
              type: 'string',
              enum: ['user', 'employer', 'admin'],
              description: 'User role'
            },
            phone: {
              type: 'string',
              description: 'User phone number'
            },
            address: {
              type: 'string',
              description: 'User address'
            }
          }
        },
        Job: {
          type: 'object',
          required: ['title', 'company', 'description', 'location', 'salary', 'jobType'],
          properties: {
            _id: {
              type: 'string',
              description: 'Job ID'
            },
            title: {
              type: 'string',
              description: 'Job title'
            },
            company: {
              type: 'string',
              description: 'Company name'
            },
            description: {
              type: 'string',
              description: 'Job description'
            },
            location: {
              type: 'string',
              description: 'Job location'
            },
            salary: {
              type: 'object',
              properties: {
                min: { type: 'number', description: 'Minimum salary' },
                max: { type: 'number', description: 'Maximum salary' },
                currency: { type: 'string', default: 'USD' }
              }
            },
            jobType: {
              type: 'string',
              enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'],
              description: 'Type of employment'
            },
            experienceLevel: {
              type: 'string',
              enum: ['entry', 'mid', 'senior', 'executive'],
              description: 'Required experience level'
            },
            category: {
              type: 'string',
              description: 'Job category'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Error message'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication endpoints'
      },
      {
        name: 'Jobs',
        description: 'Job management endpoints'
      },
      {
        name: 'Users',
        description: 'User management endpoints'
      }
    ]
  },
  apis: ['./src/routes/*.js'] // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app, port) {
  // Swagger page
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in JSON format
  app.get('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log(`📚 API Documentation available at http://localhost:${port}/api-docs`);
}

module.exports = swaggerDocs;