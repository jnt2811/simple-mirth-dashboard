const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const mirthOpenApi = require('./mirth_openapi.json');
const dcHl7GatewayOpenApi = require('./dc-h7l-gateway-openapi.json');

const authRouter = require('./routes/auth');
const dashboardRouter = require('./routes/dashboard');
const trustedServiceRouter = require('./routes/trusted-service');
const endpointUrlRouter = require('./routes/endpoint-url');
const patientSyncRouter = require('./routes/patient-sync');
const appointmentSyncRouter = require('./routes/appointment-sync');

const app = express();
const PORT = 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Auth middleware
function requireAuth(req, res, next) {
  if (req.cookies && req.cookies.auth === '1') {
    return next();
  }
  return res.redirect('/login');
}

// Swagger UI
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(mirthOpenApi));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(dcHl7GatewayOpenApi));


// Routes
app.use('/', authRouter);
app.use('/dashboard', requireAuth, dashboardRouter);
app.use('/trusted-service', requireAuth, trustedServiceRouter);
app.use('/endpoint-url', requireAuth, endpointUrlRouter);
app.use('/patient-sync', requireAuth, patientSyncRouter);
app.use('/appointment-sync', requireAuth, appointmentSyncRouter);

// Root redirect
app.get('/', requireAuth, (_req, res) => {
  res.redirect('/dashboard');
});

app.listen(PORT, () => {
  console.log(`Mirth Dashboard running at http://localhost:${PORT}`);
});
