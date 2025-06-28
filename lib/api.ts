import axios from "axios";

// Ganti dengan URL backend Laravel kamu
const BASE_URL = "http://127.0.0.1:8000/api";

const getToken = () => localStorage.getItem('token')

// Fungsi registrasi
export async function register(
  name: string,
  email: string,
  password: string,
  password_confirmation: string
) {
  try {
    const response = await axios.post(`${BASE_URL}/register`, {
      name,
      email,
      password,
      password_confirmation,
    });
    return response.data;
  } catch (error) {
    // Melempar error agar bisa ditangkap di komponen
    throw error;
  }
}

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${BASE_URL}/login`, {
    email,
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

//api user
export async function fetchUser() {
  const res = await fetch(`${BASE_URL}/user`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })
  return res.json()
}

export async function updateUser(id: string, data: any) {
  const token = getToken()
  if (!token) throw new Error("Token tidak ditemukan")

  const res = await fetch(`${BASE_URL}/user/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const errText = await res.text()
    console.error("Gagal update:", errText)
    throw new Error("Update gagal: " + errText)
  }

  return res.json()
}

export async function deleteUser(id: number) {
  const res = await fetch(`${BASE_URL}/user/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })
  return res.json()
}

//api buku
export async function fetchBuku() {
  const res = await fetch(`${BASE_URL}/book`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })
  return res.json()
}
export async function createBuku(data: { nama_barang: string, jumlah: number, harga: number }) {
  const res = await fetch(`${BASE_URL}/book`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function updateBuku(id: string, data: any) {
  const token = getToken()
  if (!token) throw new Error("Token tidak ditemukan")

  const res = await fetch(`${BASE_URL}/book/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const errText = await res.text()
    console.error("Gagal update:", errText)
    throw new Error("Update gagal: " + errText)
  }

  return res.json()
}

export async function deleteBuku(id: number) {
  const res = await fetch(`${BASE_URL}/book/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })
  return res.json()
}

//api author
export async function fetchPenulis() {
  const res = await fetch(`${BASE_URL}/author`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })
  return res.json()
}
export async function createPenulis(data: { name: string, nationality: string, birthdate: number }) {
  const res = await fetch(`${BASE_URL}/author`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function updatePenulis(id: string, data: any) {
  const token = getToken()
  if (!token) throw new Error("Token tidak ditemukan")

  const res = await fetch(`${BASE_URL}/author/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const errText = await res.text()
    console.error("Gagal update:", errText)
    throw new Error("Update gagal: " + errText)
  }

  return res.json()
}

export async function deletePenulis(id: number) {
  const res = await fetch(`${BASE_URL}/author/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })
  return res.json()
}

//api book_author
export async function fetchPenulisBuku() {
  const res = await fetch(`${BASE_URL}/book_author`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })
  return res.json()
}
export async function createPenulisBuku(data: { name: string, nationality: string, birthdate: number }) {
  const res = await fetch(`${BASE_URL}/author`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function updatePenulisBuku(id: string, data: any) {
  const token = getToken()
  if (!token) throw new Error("Token tidak ditemukan")

  const res = await fetch(`${BASE_URL}/book_author/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const errText = await res.text()
    console.error("Gagal update:", errText)
    throw new Error("Update gagal: " + errText)
  }

  return res.json()
}

export async function deletePenulisBuku(id: number) {
  const res = await fetch(`${BASE_URL}/book_author/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })
  return res.json()
}

