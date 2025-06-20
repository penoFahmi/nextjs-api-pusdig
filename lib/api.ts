import axios from "axios";

// Ganti dengan URL backend Laravel kamu
const BASE_URL = "http://127.0.0.1:8000/api";

export const login = async (username: string, password: string) => {
  const response = await axios.post(`${BASE_URL}/login`, {
    username,
    password,
  });
  return response.data;
};

export const logout = async (token: string | null) => {
  if (!token) throw new Error("Token tidak ditemukan");

  const res = await axios.post(
    `${BASE_URL}/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
