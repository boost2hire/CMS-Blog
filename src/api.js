// import axios form "axios";
const axios = require("axios");

const api = axios.create({
    baseURL : "http://localhost:5001/api/posts",
})

export default api;