// Nanti ganti URL ini dengan URL Web App Google Apps Script lo sendiri ya!
const API_URL = "https://script.google.com/macros/s/AKfycbzUlLmXoHg5zv_I0tyEzp76UdgyXXufItIURfO_T15qQa7MGQsEH926H92khOeCyFLLaQ/exec";

export const api = {
  request: async (action: string, method: 'GET' | 'POST' = 'GET', payload?: any) => {
    try {
      const options: RequestInit = { method, redirect: "follow" };
      if (method === 'POST') {
        options.headers = { "Content-Type": "text/plain;charset=utf-8" };
        options.body = JSON.stringify({ action, ...payload });
      }
      let url = API_URL;
      if (method === 'GET') {
        url = `${API_URL}?action=${action}`;
        if (payload) {
          const params = new URLSearchParams(payload).toString();
          url += `&${params}`;
        }
      }
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`API Error (${action}):`, error);
      return { status: 'error', message: 'Koneksi ke server gagal.' };
    }
  },

  // Fungsi khusus buat Login & Register ke GAS
  login: (username: string, password: string) => api.request('login', 'POST', { username, password }),
  register: (username: string, password: string) => api.request('addUser', 'POST', { username, password }),
};