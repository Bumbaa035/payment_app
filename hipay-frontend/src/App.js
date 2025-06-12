import React, { useState } from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

const App = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [step1Data, setStep1Data] = useState(null);
  const [step2Data, setStep2Data] = useState(null);

  const handleStep1Complete = (data) => {
    setStep1Data(data);
    setCurrentStep(2);
  };

  const handleStep2Complete = (data) => {
    setStep2Data(data);
    setCurrentStep(3);
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
  };

  const handleBackToStep2 = () => {
    setCurrentStep(2);
  };

  return (
      <div className="payment-app">
        {currentStep === 1 && (
            <Step1 onNext={handleStep1Complete} />
        )}

        {currentStep === 2 && (
            <Step2
                data={step1Data}
                onBack={handleBackToStep1}
                onNext={handleStep2Complete}
            />
        )}

        {currentStep === 3 && (
            <Step3
                onBack={handleBackToStep2}
                paymentData={{ ...step1Data, ...step2Data }}
            />
        )}
      </div>
  );
};

export default App;