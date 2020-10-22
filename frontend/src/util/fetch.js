import axios from "axios";

const publicFetch = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "/api"
      : process.env.REACT_APP_DEV_API_URL,
});

export default publicFetch;
