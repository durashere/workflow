import axios from "axios";

let baseUrl;

if (process.env.NODE_ENV === "development") {
  baseUrl = "http://localhost:3001/api/users";
} else {
  baseUrl = "/api/users";
}
// eslint-disable-next-line no-unused-vars
let token = null;

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const update = async (id, updatedObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, updatedObject);
  return response.data;
};

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data;
};

export default {
  setToken,
  getAll,
  create,
  update,
  remove,
};
