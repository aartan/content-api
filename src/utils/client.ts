import { CosmosClient, CosmosClientOptions } from "@azure/cosmos";
import dotenv from "dotenv";

dotenv.config();

export const { COSMOSDB_ENDPOINT: endpoint, COSMOSDB_KEY: key } = process.env;

const clientOptions: CosmosClientOptions = {
  endpoint: endpoint as string,
  key: key,
};

export const client = new CosmosClient(clientOptions);

module.exports = { client };
