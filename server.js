import app from "./app.js";
import { connect } from "./resources/utils/connectDb.js";
const PORT = process.env.PORT || 3000;

try {
	connect();

	app.listen(PORT, () => {
		console.log(`Sarcasm API running on port ${PORT} 🔥`);
	});
} catch (err) {
	console.log("Error starting the server");
	console.error(err);
}
