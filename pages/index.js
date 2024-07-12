import React, { useState, useEffect } from 'react';

const Home = () => {
  const [serverStatus, setServerStatus] = useState('Checking...');
  const [errorMessage, setErrorMessage] = useState('');
  const [currentOwnerStatus, setCurrentOwnerStatus] = useState('');

  useEffect(() => {
    const fetchServerStatus = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/status');
        if (!response.ok) {
          throw new Error('Failed to fetch status');
        }
        const data = await response.json();
        setServerStatus('Online');
      } catch (error) {
        setServerStatus('Offline');
        setErrorMessage('Failed to fetch status');
      }
    };

    fetchServerStatus();
    const interval = setInterval(fetchServerStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchOwnerStatus = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/owner-status');
        if (!response.ok) {
          throw new Error('Failed to fetch owner status');
        }
        const data = await response.json();
        setCurrentOwnerStatus(data.status);
      } catch (error) {
        setErrorMessage('Failed to fetch owner status');
      }
    };

    fetchOwnerStatus();
    const interval = setInterval(fetchOwnerStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  // Функция для возврата класса цвета текста в зависимости от статуса
  const getStatusTextColorClass = (status) => {
    switch (status) {
      case 'Накаленный':
        return 'text-blue-500';
      case 'На чили':
        return 'text-red-500';
      case 'Серьезный':
        return 'text-yellow-500';
      case 'Уставший':
        return 'text-gray-500';
      case 'Тильтует':
        return 'text-gray-700';
      case 'Нормальный':
        return 'text-purple-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="bg-primary/60 h-full">
      <div className="w-full h-full absolute left-24 bottom-0">
        <div className="flex flex-col justify-center xl:pt-12 xl:text-left h-full container mx-auto">
          <p className={`text-xl font-bold ${getStatusTextColorClass(currentOwnerStatus)}`}>
            Влад {currentOwnerStatus}
          </p>
        </div>
      </div>
      {errorMessage && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default Home;
