import React, { useState } from 'react';
import axios from 'axios';

const QRPayment = ({ data }) => {
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!phone) {
            setMessage('📱 Утасны дугаараа оруулна уу');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            // Жишээ backend API URL — энэ хэсгийг өөрийн backend-ээр солино
            const response = await axios.post('https://your-backend-api.mn/payment/qr', {
                phone,
                amount: data.amount,
                entityId: data.entityId,
                token: data.accessToken
            });

            setMessage('✅ Амжилттай илгээгдлээ');
        } catch (error) {
            console.error(error);
            setMessage('❌ Алдаа гарлаа');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
            <div className="text-center mb-4">
                <img src="https://i.ibb.co/1RvL83x/qr-demo.png" alt="QR код" className="mx-auto w-40 h-40" />
                <p className="text-gray-600 text-sm mt-2">Hipay/WeChat ашиглан төлбөр хийнэ үү</p>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">Утасны дугаар:</label>
                <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Утасны дугаар оруулна уу"
                    className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                />
            </div>

            <button
                onClick={handleSend}
                disabled={loading}
                className={`w-full py-2 px-4 rounded-md text-white ${
                    loading ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'
                }`}
            >
                {loading ? 'Илгээж байна...' : 'ИЛГЭЭХ'}
            </button>

            {message && (
                <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
            )}
        </div>
    );
};

export default QRPayment;