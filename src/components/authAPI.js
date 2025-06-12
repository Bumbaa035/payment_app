import axios from 'axios';

const API_URL = 'https://api.hipay.mn/auth';

export const getToken = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data.token; // { token: 'NEgxQ0x4bTJ0WXJPOW1JeA' }
  } catch (error) {
    console.error('Token авах алдаа:', error);
    throw error;
  }
};