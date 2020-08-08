const path = require('path')
const express = require('express')
const cookieParser = require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const cors = require('cors')
const dotenv = require('dotenv')
const morgan = require('morgan')
const fileupload = require('express-fileupload')
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

dotenv.config({path: './config/config.env'})

// Connect to database
connectDB();
//import route
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/user');
const review = require('./routes/reviews');



const app = express()

//Body Parser
app.use(express.json())
app.use(cookieParser())



// Dev logging Middleware
if(process.env.NODE_ENV === 'devlopment'){
    app.use(morgan('dev'))
}
// File UPload
app.use(fileupload())
//Sanitize data
app.use(mongoSanitize())
app.use(helmet())
app.use(xss())

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100
})
app.use(limiter)
app.use(hpp())

app.use(cors())
// set statci folder
app.use(express.static(path.join(__dirname, 'pulic')))
//Mount routes
app.use('/api/v1/bootcamps',bootcamps)
app.use('/api/v1/courses',courses)
app.use('/api/v1/auth',auth)
app.use('/api/v1/users',users)
app.use('/api/v1/review',review)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
const server = app.listen(
    PORT,
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    )
  );
  
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
  });
  