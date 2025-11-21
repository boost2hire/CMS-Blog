import { Link } from "react-router-dom"

 export default function HomePage() {
    return (
        <>
         <section className="flex flex-col items-center justify-center text-center mt-60">
               <h1 className="uppercase font-bold text-4xl tracking-wide mb-5 md:text-6xl lg:text-8xl">My Blog</h1>

               <button>
                <Link to="/blog" className="py-2 px-6 rounded shadow text-white bg-black hover:bg-transparent border-2 border-black transition-all duration-500 hover:text-black font-bold"> Read my Blog Post</Link>
               </button>
         </section>
        </>
    )
}
