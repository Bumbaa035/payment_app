import React, { useState } from 'react';
import Step1 from './Step1.jsx'; // Таны Step1 файлын нэр
import Step2 from './Step2.jsx';

const App = () => {
  const [step, setStep] = useState(1);
  const [paymentData, setPaymentData] = useState(null);

  const handleStep1Next = (data) => {
    // Step1-с ирсэн төлбөрийн мэдээллийг хадгална
    setPaymentData({
      ...data,
      token: 'NEgxQ0x4bTJ0WXJPOW1JeA',
      checkoutId: 'HPSM250612104345000000006',
      qrData: '0002010102121531422604964226049600000000001020417810017com.qq.weixin.pay01091367888090202NT0537weixin://wxpay/bizpayurl?pr=siTObRFz126540014A00000084300010108HPSMMNUB0220MN09005151019910985533410037A111278300000000.alipayplus.v2025051351120008songo.mn5204581153034965406102.435802MN5916Songo.mn-Eastpay6011ULAANBAATAR62340125HPSM2506121043450000000065201180240014A0000008430001010201630412F8',
      shopperResultUrl: 'https://test.hipay.mn:4445/shopperResultUrl.php',
      shopperCancelUrl: 'https://test.hipay.mn:4445/',
      lang: 'en',
      method: 'post'
    });
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <div>
      {step === 1 && <Step1 onNext={handleStep1Next} />}
      {step === 2 && <Step2 data={paymentData} onBack={handleBack} />}
    </div>
  );
};

export default App;
