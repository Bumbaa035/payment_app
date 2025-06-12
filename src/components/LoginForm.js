import { useState } from 'react';
import { getToken } from '../services/authAPI';

function LoginForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken(formData);
      localStorage.setItem('hipay_token', token);
      // Token авсан үед шилжих
      window.location.href = '/checkout';
    } catch (error) {
      alert('Нэвтрэх алдаа: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Формын элементүүд */}
    </form>
  );
}