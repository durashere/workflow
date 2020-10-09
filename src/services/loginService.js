import axios from "axios";

let baseUrl;

if (process.env.NODE_ENV === "development") {
  baseUrl = "http://localhost:3001/api/login";
} else {
  baseUrl = "/api/login";
}

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials);
  return response.data;
};

export default { login };
