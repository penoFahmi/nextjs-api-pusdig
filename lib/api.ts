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

// Ganti bagian "api Peminjaman" Anda dengan ini

// =================================
// == LOAN MANAGEMENT
// =================================

/** (UNTUK ADMIN) Mengambil semua data peminjaman. */
export async function fetchAllLoans() {
  const res = await fetch(`${BASE_URL}/loan`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) throw new Error("Gagal mengambil data peminjaman.");
  return res.json();
}

/** (UNTUK PEMINJAM) Mengambil data peminjaman milik sendiri. */
export async function fetchMyLoans() {
  const res = await fetch(`${BASE_URL}/my-loans`, { // Endpoint baru
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) throw new Error("Gagal mengambil data peminjaman Anda.");
  return res.json();
}

/** (UNTUK ADMIN) Membuat transaksi peminjaman baru. */
export async function createLoan(data: { user_id: string; book_ids: string[]; tanggal_kembali: string; }) {
  const res = await fetch(`${BASE_URL}/loan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data), // Payload baru
  });
  if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Gagal membuat peminjaman.");
  }
  return res.json();
}

/** (UNTUK ADMIN) Mengembalikan buku dari sebuah peminjaman. */
export async function returnLoan(id: string, data: { books_status: { id: string; status: 'Baik' | 'Rusak' }[] }) {
  const res = await fetch(`${BASE_URL}/loan/${id}/return`, { // Endpoint baru
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data), // Payload baru
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Gagal mengembalikan buku.");
  }
  return res.json();
}

/** (UNTUK ADMIN) Menghapus data peminjaman. */
export async function deleteLoan(id: string) { // ID seharusnya string untuk ULID
  const res = await fetch(`${BASE_URL}/loan/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Gagal menghapus peminjaman.");
  }
  return res.json();
}

export async function payFine(id: string) {
  const res = await fetch(`${BASE_URL}/loan/${id}/pay`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Gagal memproses pembayaran denda.");
  }
  return res.json();
}

// ... (fungsi API lainnya)

/** Mengambil data statistik utama untuk dasbor. */
export async function getDashboardStats() {
  try {
    const res = await fetch(`${BASE_URL}/dashboard/stats`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    if (!res.ok) throw new Error("Gagal mengambil statistik dasbor.");
    return res.json();
  } catch (error) {
    throw error;
  }
}

// ... (fungsi API lainnya)

/** Mengambil daftar 5 peminjaman yang paling telat. */
export async function getOverdueLoans() {
  try {
    const res = await fetch(`${BASE_URL}/dashboard/overdue-loans`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    if (!res.ok) throw new Error("Gagal mengambil data peminjaman telat.");
    return res.json();
  } catch (error) {
    throw error;
  }
}

// ... (fungsi API lainnya)

/** Mengambil data untuk grafik aktivitas peminjaman. */
export async function getLoanActivity() {
  try {
    const res = await fetch(`${BASE_URL}/dashboard/loan-activity`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    if (!res.ok) throw new Error("Gagal mengambil data aktivitas peminjaman.");
    return res.json();
  } catch (error) {
    throw error;
  }
}

/** Mengambil data buku terpopuler bulan ini. */
export async function getPopularBooks() {
  try {
    const res = await fetch(`${BASE_URL}/dashboard/popular-books`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    if (!res.ok) throw new Error("Gagal mengambil data buku terpopuler.");
    return res.json();
  } catch (error) {
    throw error;
  }
}

// ... (fungsi API lainnya)

// =================================
// == REPORTS
// =================================

/** Mengambil data laporan berdasarkan tipe dan filter. */
export async function getReport(reportType: string, params: { start_date: string, end_date: string }) {
  try {
    // Membuat URL dengan query-string
    const url = new URL(`${BASE_URL}/reports/${reportType}`);
    url.search = new URLSearchParams(params).toString();
    
    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    if (!res.ok) throw new Error("Gagal mengambil data laporan.");
    return res.json();
  } catch (error) {
    handleError(error);
  }
}

// Fungsi spesifik untuk laporan yang tidak butuh filter tanggal
export async function getBookInventoryReport() {
    try {
        const res = await fetch(`${BASE_URL}/reports/book-inventory`, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
        if (!res.ok) throw new Error("Gagal mengambil data inventaris buku.");
        return res.json();
    } catch (error) {
        handleError(error);
    }
}