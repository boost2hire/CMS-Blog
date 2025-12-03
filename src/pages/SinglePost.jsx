// src/pages/SinglePost.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export default function SinglePost() {
  const { id } = useParams();
  const [singlePost, setSinglePost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5001/api/posts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSinglePost(data);
        setIsLoading(false);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (isLoading) {
    return (
      <h1 className="uppercase font-bold text-4xl tracking-wide mb-5 md:text-6xl lg:text-8xl flex items-center justify-center h-screen">
        Loading...
      </h1>
    );
  }

  if (!singlePost) {
    return (
      <h1 className="text-center mt-20 text-xl text-red-500">
        Post not found.
      </h1>
    );
  }

  return (
    <section className="px-5 xl:max-w-6xl pb-50">
      <h1 className="uppercase font-bold text-4xl tracking-wide mb-5 md:text-6xl lg:text-8xl text-center mt-5">
        {singlePost.title}
      </h1>

      {singlePost.mainImage?.asset?.url && (
        <img
          src={singlePost.mainImage.asset.url}
          alt={singlePost.title}
          className="blog__image"
        />
      )}

      <p className="text-center py-8">By Piyush</p>

      {/* ✔ RENDER HTML BODY */}
      <div
        className="prose prose-lg max-w-3xl mx-auto mt-10"
        dangerouslySetInnerHTML={{ __html: singlePost.body }}
      />

      <Link
        to="/blog"
        className="py-2 px-6 rounded shadow text-white bg-black hover:bg-transparent border-2 border-black transition-all duration-500 hover:text-black font-bold inline-block mt-6 mb-10 flex justify-center w-60 mx-auto"
      >
        Read another article
      </Link>
    </section>
  );
}
