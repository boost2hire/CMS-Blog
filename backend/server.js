import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import postsRoutes from "./routes/posts.js";
import sanity from "./sanity.js"


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
      res.send("Serve is running😊");
    })
app.use("/api/posts", postsRoutes);

app.listen(process.env.PORT, () => {
   console.log(`Server running at http://localhost:${process.env.PORT}`);  
})