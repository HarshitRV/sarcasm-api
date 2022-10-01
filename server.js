/**
 * Module Imports
 */
import express, {
    urlencoded,
    json
} from "express"
import cors from "cors";
import morgan from "morgan";
import {
    connect
} from "./resources/utils/connectDb.js";

/**
 * Router Imports
 */
import SarcasmRouter from "./resources/routes/sarcasm/sarcasm.router.js";
import UserRouter from "./resources/routes/user/user.router.js";

/**
 * Declarations
 */

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Middleware
 */
app.use(json());
app.use(urlencoded({
    extended: true
}));
app.use(cors());
app.use(morgan("dev"));

/**
 * Routes
 */

app.use('/', SarcasmRouter);
app.use('/user', UserRouter);

// Status check route
app.route("/status").get((req, res)=>{
    return res.status(200).json({
        "status": 200,
        "msg": "Server running"
    })
})

/**
 * Default Error Handling Middleware
 */
app.use((err, req, res, next) => {
    const {
        status = 500, message = "Internal Server Error"
    } = err;
    const error_trace = err.stack
    res.status(status).send({
        status,
        message,
        error_trace
    });

})

const start = async () => {
    try {
        connect();

        app.listen(PORT, () => {
            console.log(`REST API on http://localhost:${PORT}/`);
        });
    } catch (err) {
        console.error(err, "This is the error in starting the server");
    }
};
start();