import mongoose from "mongoose";
import { logger } from "../logger/logger.js";

/**
 * To connect to the database
 */
export const databaseConnection = () => {
  const database = process.env.DATABASE_URL;
  mongoose
    .connect(database)
    .then(() => {
      logger.info("Connected to the database");
    })
    .catch((error) => {
      logger.error(`Could not connect to the database \n ${error}`);
    });
};
