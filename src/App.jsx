// ALL imports must be at the top ⬇️
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import Blog from "./pages/Blog";
import SinglePost from "./pages/SinglePost";
import Error from "./pages/Error";
import AddPost from "./pages/AddPost";
import EditPost from "./pages/EditPost";

import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<SinglePost />} />  {/* FIXED */}
        {/* <Route path="/posts" element={ <PostsList />} /> */}
        <Route path="/add" element= { <AddPost />} />
        <Route path="/edit/:id" element= { <EditPost />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
