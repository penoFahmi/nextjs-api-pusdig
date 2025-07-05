import axios from "axios";

// Ganti dengan URL backend Laravel kamu
const BASE_URL = "http://127.0.0.1:8000/api";

const getToken = () => localStorage.getItem('token')

// Fungsi registrasi
export async function register(
name: string, email: string, password: string, password_confirmation: string, token: string | null) {
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
export async function createUser(data: { name: string, email: string }) {
  const res = await fetch(`${BASE_URL}/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
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
export async function deleteAccount(userId: string) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token tidak ditemukan");
  }

  const res = await fetch(`${BASE_URL}/user/${userId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Gagal menghapus akun.');
  }

  if (res.status === 204) {
    return { message: 'Akun berhasil dihapus.' };
  }

  return res.json();
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
export async function createBuku(data: { title: string, isbn: number, publisher: string, year_published: number, stock: number }) {
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
export async function createPenulisBuku(data: { book_id: string, author_id: string }) {
  const res = await fetch(`${BASE_URL}/book_author`, {
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

//api Peminjaman
export async function fetchPeminjamanBuku() {
  const res = await fetch(`${BASE_URL}/loan`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })
  return res.json()
}
export async function createPeminjamanBuku(data: { user_id: string, book_id: string }) {
  const res = await fetch(`${BASE_URL}/loan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function updatePeminjamanBuku(id: string, data: any) {
  const token = getToken()
  if (!token) throw new Error("Token tidak ditemukan")

  const res = await fetch(`${BASE_URL}/loan/${id}`, {
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

export async function deletePeminjamanBuku(id: number) {
  const res = await fetch(`${BASE_URL}/loan/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })
  return res.json()
}