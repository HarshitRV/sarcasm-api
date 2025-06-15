import app from './sarcasm-app/app/app.js';
import { appConfig } from './config/app-config.js';

const PORT = appConfig.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
