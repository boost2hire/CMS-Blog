import { useState } from "react";
import { data, useNavigate } from "react-router-dom";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit"

export default function AddPost() {
    const navigate = useNavigate();

    const[title, setTitle] = useState("");
    const[image, setImage] = useState(null);
    const[body, setBody] = useState("");

    const editor = useEditor({
        extensions: [StarterKit],
        content: "",
    })

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append("image", file);
        
        const res = await fetch("http://localhost:5001/api/posts/upload", {
            method: "POST",
            body: formData,
        })
        return await res.json();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const postbody = editor.getHTML();
        let uploadedImage = null;
        let mainImage = null;

                if (image) {
            uploadedImage = await uploadImage(image);
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
            const res = await fetch("http://localhost:5001/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    body: postbody,
                mainImage}),
            })
             const text = await res.text();
             console.log("Server Raw Response:", text);
             
                // console.log("Created:", data);
                
                navigate("/blog");
        } catch(err) {
            console.error("Create Error:", err)
        }
    }

    return (
        <section className="px-5 py-10 max-w-3xl mx-auto">
           <h1 className="text-4xl font-bold mb-6 text-center">
            Create New Post
           </h1>

           <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-lg font-semibold">Title</label>
                    <input 
                    type="text"
                    placeholder="Enter title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 border rounded"
                    required
                    />
                </div>

                <div>
                    <label className="block text-lg font-semibold"> Body</label>
                   <div 
                   className="border p-3 rounded bg-white">
                    <EditorContent editor={editor} />
                   </div>
                </div>

                 <div>
                    <label className="font-semibold text-lg">Main Image</label>
                    <input type="file"
                    accept="image/*" 
                    className="block mt-3"
                    onChange={(e) => setImage(e.target.files[0])}/>
                 </div>


                <button
                type="submit"
                className="bg-black text-white py-3 px-6 rounded shadow hover:text-black border border-black transition">
                    Publish Post
                </button>
           </form>
        </section>
    )
}