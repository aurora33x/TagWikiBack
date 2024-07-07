import cors from 'cors';
import express from "express";
import mongoose from "mongoose";
import path from "path";
import vote from "./routes/api/vote";
import routes from "./routes/index";

var cookieParser = require("cookie-parser");
var logger = require("morgan");
const expressSession = require("express-session");
const password = encodeURIComponent(process.env.MONGODB_PASSWORD.trim());
const connectionString = `mongodb+srv://HXu001:${password}@cluster0.r4pzwxn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

var app = express();

require("dotenv").config();

const session = {
    secret: 'secret123',
    cookie: {},
    resave: false,
    saveUninitialized: false,
};

if (app.get("env") === "production") {
    session.cookie.secure = true;
}

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, '../public')));

// Serve up the frontend's "build" directory, if we're running in production mode.
if (process.env.NODE_ENV === "production") {
    console.log("Running in production!");
    app.use(express.static(path.join(__dirname, "../../frontend/build")));

    // If we get any GET request we can't process using one of the server routes, serve up index.html by default.
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../../frontend/build/index.html"));
    });
}

app.use(expressSession(session));

app.use(vote);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const corsOptions = {
    origin: [
        'http://tagwiki.net:3000',
        'http://3.106.134.8:3000',
        'http://tagwiki.net'
    ],
    credentials: true,
    optionSuccessStatus: 200
};
app.use(cors(corsOptions));
// app.use((_req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', '*');

//     next();
//   });
app.use("/", routes);


console.log(`env:${app.get('env')}`);
if (app.get("env") !== "test") {
    mongoose.connect(
        connectionString,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    ).then(() => {
        console.log('MongoDB connected');
    }).catch(err => {
        console.error('MongoDB connection error:', err);
    });
}


export default app;
