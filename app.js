require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const expressSession = require('express-session');
const MongoStore = require('connect-mongo')
const methodOverride = require('method-override');
const helmet = require('helmet');

// Models
const User = require('./models/UserSchema');

// Variables
const mongo_url = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/InterviewApp'

const app = express();
const port = 3000;

// MongoDB Connection
mongoose.connect(mongo_url)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));


// Set EJS as template engine
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.json());
app.use(helmet());

//mongo store
const store = MongoStore.create({
    mongoUrl: mongo_url,
    crypto: {
        secret: "AnirbanOpi1234",
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("error in moongoose session", err);
});

// Session configuration
app.use(expressSession({
    store,
    secret: 'AnirbanOpi1234',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 }, // 1 week
}));

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "https://cdn.tailwindcss.com",
        "https://unpkg.com",
        "'unsafe-inline'", // If you're using inline scripts like Tailwind config
      ],
      styleSrc: [
        "'self'",
        "https://fonts.googleapis.com",
        "'unsafe-inline'",
      ],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "https://img.freepik.com", "data:"],
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.user = req.user || null; // Make user available in all EJS views
    next();
});


// Routes
const indexRoutes = require('./routes/indexRoutes');
const userRoutes = require('./routes/userRoutes')
const jobSearchRoutes = require("./routes/jobsearch");

app.use('/', indexRoutes);
app.use('/users', userRoutes);
app.use("/jobs", jobSearchRoutes);

// 404 Not Found Handler
app.use((req, res, next) => {
    res.status(404).render('error', { error: { status: 404, message: "Page Not Found" } });
});

// General Error Handler
app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;
    res.status(status).render('error', { error: { status, message } });
});

// Start server
app.listen(port, () => {
    console.log(`App is running on port ${port} http://localhost:${port}/home`);
});
