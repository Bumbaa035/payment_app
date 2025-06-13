import React, { useState } from "react";
import Step1 from "./step1.jsx";
import Step2 from "./step2.jsx";
import Step3 from "./step3.jsx";

const App = () => {
  const [step, setStep] = useState(1);
  const [paymentData, setPaymentData] = useState(null);

  const handleStep1Next = (data) => {
    // Step1-с ирсэн төлбөрийн мэдээллийг хадгална
    setPaymentData({
      ...data,
      // Default values for Step2 - these can be overridden in Step2
      checkoutId: "HPSM250612121340000000013",
      qrData:
        "0002010102121531422604964226049600000000001020417810017com.qq.weixin.pay01091367888090202NT0537weixin://wxpay/bizpayurl?pr=siTObRFz126540014A00000084300010108HPSMMNUB0220MN09005151019910985533410037A111278300000000.alipayplus.v2025051351120008songo.mn5204581153034965406102.435802MN5916Songo.mn-Eastpay6011ULAANBAATAR62340125HPSM2506121043450000000065201180240014A0000008430001010201630412F8", // This should be generated from actual API
      shopperResultUrl: "https://test.hipay.mn:4445/shopperResultUrl.php",
      shopperCancelUrl: "https://test.hipay.mn:4445/",
      lang: "mn",
      method: "post",
    });
    setStep(2);
  };

  const handleStep2Next = (data) => {
    // Update payment data with Step2 form data
    setPaymentData((prevData) => ({
      ...prevData,
      ...data,
    }));
    console.log("Final payment data for Step3:", { ...paymentData, ...data });
    setStep(3);
  };

  const handleStep2Back = () => {
    setStep(1);
  };

  const handleStep3Back = () => {
    setStep(2);
  };

  return (
    <div>
      {step === 1 && <Step1 onNext={handleStep1Next} />}
      {step === 2 && (
        <Step2
          data={paymentData}
          onBack={handleStep2Back}
          onNext={handleStep2Next}
        />
      )}
      {step === 3 && <Step3 data={paymentData} onBack={handleStep3Back} />}
    </div>
  );
};

export default App;
