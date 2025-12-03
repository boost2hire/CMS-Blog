import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Blog() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = () => {
    fetch("http://localhost:5001/api/posts")
    .then((res) => res.json())
    .then((data) => {
      if(Array.isArray(data)) setPosts(data);
      else setPosts([]);
    })
    .catch((err) => {
      console.error(err);
      setPosts([])
    })
  }

  //************DELETE */

  useEffect(() => {
    fetchPosts();
  }, [])

  const deletePost = async (id) => {
    const confirmDelete = window.confirm("Are you sure want to delete this post?")
    if(!confirmDelete) return;

    try {
      await fetch(`http://localhost:5001/api/posts/${id}`, {
        method: "DELETE",
      });

      fetchPosts();
    } catch(err) {
      console.error("Delete error:", err)
    }
  }
////////////////*************************///////////////////// */

  return (
    <section className="px-5 2xl:max-w-7xl 2xl:mx-auto">
      <h1 className="font-bold text-4xl mt-5 mb-5 tracking-widest text-center md:text-6xl lg:text-8xl">
        Blog Page
      </h1>

      <h1 className="text-xl text-center mb-10">
        You are viewing {posts.length} blog posts
      </h1>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article key={post._id} className="p-4 shadow rounded">

            {/* Image check */}
            {post.mainImage?.asset?.url && (
              <img
                src={post.mainImage.asset.url}
                alt={post.title}
                className="w-full h-auto"
              />
            )}

            <h4 className="text-xl mt-4 mb-3">{post.title}</h4>

            <Link
         to={`/blog/${post._id}`}
                className="py-2 px-6 rounded shadow text-white bg-black hover:bg-transparent border-2 border-black transition-all duration-500 hover:text-black font-bold inline-block"
            >
              Read full article
            </Link>

            <div className="flex gap-3 mt-4">
          
            <Link 
             to={`/edit/${post._id}`}
             className="py-2 px-4 rounded bg-blue-600 text-white hover:bg-blue-800 transition-all"
              >
                Edit
              </Link>

              <button
              onClick={() => deletePost(post._id)}
              className="py-2 px-4 rounded bg-red-600 text-white hover:bg-red-800 transition-all"
              >
                Delete
              </button>

              <Link
               to={`/add`}
              className="py-2 px-4 rounded bg-green-600 text-white hover:bg-green-800 transition-all"
              >
                Add Post
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
