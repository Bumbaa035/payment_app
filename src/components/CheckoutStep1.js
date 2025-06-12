useEffect(() => {
  // Компонент дуудагдах үед token шалгах
  const token = localStorage.getItem('hipay_token');
  if (!token) {
    // Token байхгүй бол нэвтрэх хуудасруу шилжих
    window.location.href = '/login';
  } else {
    // Token байгаа бол form-д автоматаар бөглөх
    setForm(prev => ({ ...prev, token }));
  }
}, []);