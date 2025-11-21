import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config(); 

console.log("Loaded ENV:", {
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: process.env.SANITY_API_VERSION,
  tokenExists: !!process.env.SANITY_TOKEN,
});

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: process.env.SANITY_API_VERSION,
  token: process.env.SANITY_TOKEN, // must be READ from env
  useCdn: false
});

export default client;
