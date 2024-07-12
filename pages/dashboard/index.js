import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const Dashboard = () => {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [serverStatus, setServerStatus] = useState('Checking...');
  const [showLoginButton, setShowLoginButton] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // State to control visibility of success message
  const [showStatusChangedMessage, setShowStatusChangedMessage] = useState(false); // State to control visibility of status changed message

  useEffect(() => {
    const fetchServerStatus = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/status');
        if (response.ok) {
          setServerStatus('Online');
          setTimeout(() => {
            setShowLoginButton(true);
          }, 1000);
        } else {
          setServerStatus('Offline');
        }
      } catch (error) {
        console.error('Error checking server status:', error);
        setServerStatus('Offline');
      }
    };

    fetchServerStatus();
    const interval = setInterval(fetchServerStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async () => {
    setSuccessMessage('');
    setErrorMessage('');
    setIsLoggedIn(true);

    // Perform login logic here
    if (login === 'vlad' && password === '123') {
      setSuccessMessage('Logged in successfully!');
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } else {
      setErrorMessage('Incorrect login or password.');
      setIsLoggedIn(false);
    }
  };

  const handleStatusSelect = async (status) => {
    setSelectedStatus(status);
    try {
      const response = await fetch('http://localhost:3001/api/update-owner-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error('Failed to update owner status');
      }
      const data = await response.json();
      console.log(data);
      setShowStatusChangedMessage(true);
      setTimeout(() => {
        setShowStatusChangedMessage(false);
      }, 3000);
    } catch (error) {
      setErrorMessage('Failed to update owner status');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSelectedStatus('');
    setSuccessMessage('');
    setErrorMessage('');
    router.push('/dashboard');
  };

  if (!isLoggedIn) {
    return (
      <div className="bg-gray-600 min-h-screen flex items-center justify-center">
        <div className="bg-primary/70 w-96 py-6 px-8 flex flex-col items-center rounded-lg">
          <h1 className="text-4xl font-bold text-white mb-6">LOGIN</h1>
          <input
            type="text"
            placeholder="Login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            className="input-field mb-4 bg-primary/10"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field mb-4 bg-primary/10"
          />
          {serverStatus === 'Checking...' && <p className="text-white mb-4">Checking...</p>}
          {showLoginButton && (
            <button onClick={handleLogin} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
              Login
            </button>
          )}
          {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-600 min-h-screen flex">
      <div className="bg-primary/70 w-80 py-4 px-6 flex-shrink-0">
        <h1 className="text-4xl font-bold text-white mb-6">MENTHAL CONDITION FOR BRO</h1>

        <div className="mt-8">
          <h2 className="text-xl font-bold text-white mb-4">Выбери своё состояние</h2>
          <button className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-4 mb-4 ${selectedStatus === 'Накаленный' ? 'bg-blue-700' : ''}`} onClick={() => handleStatusSelect('Накаленный')} disabled={serverStatus !== 'Online'}>Накаленный</button>
          <button className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-4 mb-4 ${selectedStatus === 'На чили' ? 'bg-red-700' : ''}`} onClick={() => handleStatusSelect('На чили')} disabled={serverStatus !== 'Online'}>На чили</button>
          <button className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4 mb-4 ${selectedStatus === 'Серьезный' ? 'bg-yellow-700' : ''}`} onClick={() => handleStatusSelect('Серьезный')} disabled={serverStatus !== 'Online'}>Серьезный</button>
          <button className={`bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-4 mb-4 ${selectedStatus === 'Уставший' ? 'bg-gray-700' : ''}`} onClick={() => handleStatusSelect('Уставший')} disabled={serverStatus !== 'Online'}>Уставший</button>
          <button className={`bg-gray-900 hover:bg-gray-950 text-white font-bold py-2 px-4 rounded mb-4 ${selectedStatus === 'Тильтует' ? 'bg-gray-700' : ''}`} onClick={() => handleStatusSelect('Тильтует')} disabled={serverStatus !== 'Online'}>Тильт</button>
          <button className={`bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mb-4 ${selectedStatus === 'Нормальный' ? 'bg-purple-700' : ''}`} onClick={() => handleStatusSelect('Нормальный')} disabled={serverStatus !== 'Online'}>Нормальный</button>
        </div>

        <button onClick={handleLogout} className="mt-8 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
          Logout
        </button>

        {showSuccessMessage && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
            {successMessage}
          </div>
        )}

        {showStatusChangedMessage && (
          <div className="fixed bottom-4 right-4 bg-purple-500 text-white p-4 rounded-lg shadow-lg">
            Status is Changed!
          </div>
        )}

        {errorMessage && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg">
            {errorMessage}
          </div>
        )}

        <div className="absolute bottom-4 left-4">
          <p className={`text-lg font-bold ${serverStatus === 'Online' ? 'text-green-500' : 'text-yellow-500'}`}>
            {serverStatus === 'Checking...' ? <span>Checking<span className="animate-pulse">...</span></span> : serverStatus}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
