import express from "express";
import bodyParser from "body-parser";
import contentRoutes from "./routes/contentRoutes";
import cors from "cors";
import dotenv from "dotenv";
import logger from "./utils/logger";
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());

app.use(bodyParser.json());

app.use("/content", contentRoutes);

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
