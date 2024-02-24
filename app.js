/**
 * Module Imports
 */
import express, { urlencoded, json } from "express";
import cors from "cors";
import morgan from "morgan";

/**
 * Router Imports
 */
import SarcasmRouter from "./resources/routes/sarcasm/sarcasm.router.js";
import UserRouter from "./resources/routes/user/user.router.js";

/**
 * Declarations
 */

const app = express();

/**
 * Middleware
 */
app.use(json());
app.use(
	urlencoded({
		extended: true,
	})
);
app.use(cors());
app.use(morgan("dev"));

/**
 * Routes
 */

app.use("/", SarcasmRouter);
app.use("/api/v1", UserRouter);

// Status check route
app.route("/status").get((req, res) => {
	return res.status(200).json({
		status: 200,
		msg: "Server running",
	});
});

/**
 * Default Error Handling Middleware
 */
app.use((err, req, res, next) => {
	const { status = 500, message = "Internal Server Error" } = err;
	const error_trace = err.stack;
	res.status(status).send({
		success: false,
		message,
		error_trace,
	});
});

export default app;
