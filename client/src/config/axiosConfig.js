import axios from "axios";
const instance = axios.create({
  // baseURL: "http://127.0.0.1:5000/",
  // baseURL: "http://192.168.0.104:5000/",
  baseURL: "",
});

export default instance;
