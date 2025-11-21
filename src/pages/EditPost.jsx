import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });

  // Fetch existing post
  useEffect(() => {
    fetch(`http://localhost:5000/api/posts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title);
        setExistingImageUrl(data.mainImage?.asset?.url || null);

        // Load HTML body into Tiptap
        editor?.commands.setContent(data.body || "");
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [id, editor]);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("http://localhost:5000/api/posts/upload", {
      method: "POST",
      body: formData,
    });

    return await res.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postBody = editor.getHTML();
    let mainImage = null;

    // If user selected a new image
    if (image) {
      const uploadedImage = await uploadImage(image);
      console.log("Uploaded Image:", uploadedImage);

      if (uploadedImage.assetId) {
        mainImage = {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: uploadedImage.assetId,
          },
        };
      }
    }

    try {
      const res = await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          body: postBody,
          ...(mainImage && { mainImage }), // only send if new image
        }),
      });

      const text = await res.text();
      console.log("Update Response:", text);

      navigate("/blog");
    } catch (err) {
      console.error("Update Error:", err);
    }
  };

  if (loading) {
    return (
      <h1 className="uppercase font-bold text-4xl text-center h-screen flex items-center justify-center">
        Loading...
      </h1>
    );
  }

  return (
    <section className="px-5 py-10 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center">Edit Post</h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Title */}
        <div>
          <label className="block text-lg font-semibold">Title</label>
          <input
            type="text"
            className="w-full p-3 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Body */}
        <div>
          <label className="block text-lg font-semibold">Body</label>
          <div className="border p-3 rounded bg-white">
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Existing Image */}
        {existingImageUrl && (
          <div>
            <p className="font-semibold mb-2">Current Image:</p>
            <img
              src={existingImageUrl}
              alt="Current"
              className="w-64 rounded shadow mb-4"
            />
          </div>
        )}

        {/* Upload new image */}
        <div>
          <label className="font-semibold text-lg">Replace Image</label>
          <input
            type="file"
            accept="image/*"
            className="block mt-3"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-black text-white py-3 px-6 rounded shadow hover:text-black border border-black transition w-full"
        >
          Update Post
        </button>
      </form>
    </section>
  );
}
