import express from "express";
import client from "../sanity.js";
import multer from "multer";
import fs from "fs";


const router = express.Router();

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      console.log("NO FILE RECEIVED");
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;

    const img = await client.assets.upload(
      "image",
      fs.createReadStream(filePath),
      { filename: req.file.originalname }
    );

    fs.unlinkSync(filePath);

    res.json({
      assetId: img._id,
      imageUrl: img.url,
    });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ************************ CREATE *****************************************

router.post("/", async (req, res) => {
  try {

    const { title, body, mainImage} = req.body;

    const doc = await client.create({
      _type: "post",
      title,
      body,
      mainImage,
    });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ************************ READ *****************************************

// GET ALL POSTS
router.get("/", async (req, res) => {
  try {
    const query = `*[_type == "post"]{
      _id,
      title,
      body,
      mainImage{
        asset->{
          _id,
          url
        },
        alt
      }
    }`;

    const data = await client.fetch(query);
    res.json(data);
  } catch (err) {
    console.error("SANITY QUERY ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET SINGLE POST

router.get("/:id", async (req, res) => {
  try {
    console.log("REQ PARAM ID:", req.params.id);

    const query = `*[_type == "post" && _id == $id][0]{
      _id,
      title,
      body,
      mainImage{
        asset->{
          url
        }
      }
    }`;

    const params = { id: req.params.id };
    const post = await client.fetch(query, params);

    console.log("SANITY RESULT:", post);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ************************ UPDATE *****************************************

router.put("/:id", async (req, res) => {
  try {
    const updated = await client
      .patch(req.params.id)
      .set({
        title: req.body.title,
        body: req.body.body,
      })
      .commit();

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ************************ DELETE *****************************************

router.delete("/:id", async (req, res) => {
  try {
    await client.delete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
