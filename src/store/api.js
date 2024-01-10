import axios from "axios";

//const API = axios.create({ baseURL: "https://stedtraslados.ibsmexico.com.mx/stedapi/api" });
//const API = axios.create({ baseURL: "https://devdes.ibsmexico.com.mx/apisted/api" }); 
const API = axios.create({ baseURL: "https://localhost:7126/api" }); 
  
API.interceptors.request.use((req) => {
  if (localStorage.getItem("user")) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("user")).token
      }`;
  }
  return req;
});

export default API

