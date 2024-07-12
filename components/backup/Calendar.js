import React, { useState, useEffect } from 'react';
import axios from 'axios';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const Calendar = () => {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(null);
  const [numberOfDays, setNumberOfDays] = useState(null);
  const [currentYear, setCurrentYear] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(null);
  const [isNextMonth, setIsNextMonth] = useState(false);

  useEffect(() => {
    // Запрос на сервер для получения текущего месяца, количества дней и года
    const fetchData = async () => {
      try {
        const monthResponse = await axios.get('http://localhost:3001/currentDate');
        
        setCurrentMonthIndex(monthResponse.data.currentMonth);
        setCurrentMonth(months[monthResponse.data.currentMonth - 1]);
        setNumberOfDays(monthResponse.data.numberOfDays);
        setCurrentYear(monthResponse.data.currentYear);
      } catch (error) {
        console.error('Ошибка при получении данных с сервера:', error);
      }
    };
    fetchData();
    setIsNextMonth(false); // Сброс флага переключения на следующий месяц
  }, []);

  const switchToNextMonth = async () => {
    try {
      // Отправляем запрос на сервер для получения информации о следующем месяце
      const nextMonthResponse = await axios.get('http://localhost:3001/nextMonth');

      setCurrentMonthIndex(nextMonthResponse.data.nextMonth);
      setCurrentMonth(months[nextMonthResponse.data.nextMonth - 1]);
      setNumberOfDays(nextMonthResponse.data.nextNumberOfDays);
      setIsNextMonth(true);
    } catch (error) {
      console.error('Ошибка при получении данных о следующем месяце:', error);
    }
  };

  const switchToCurrentMonth = async () => {
    try {
      // Отправляем запрос на сервер для получения информации о текущем месяце
      const currentMonthResponse = await axios.get('http://localhost:3001/currentDate');

      setCurrentMonthIndex(currentMonthResponse.data.currentMonth);
      setCurrentMonth(months[currentMonthResponse.data.currentMonth - 1]);
      setNumberOfDays(currentMonthResponse.data.numberOfDays);
      setCurrentYear(currentMonthResponse.data.currentYear);
      setIsNextMonth(false);
    } catch (error) {
      console.error('Ошибка при получении данных о текущем месяце:', error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1>Month: {currentMonth}</h1>
      <h1>Number of days in the month: {numberOfDays}</h1>
      <h1>Year: {currentYear}</h1>
      {!isNextMonth && <button onClick={switchToNextMonth}>Next month</button>}
      {isNextMonth && <button onClick={switchToCurrentMonth}>Current month</button>}
    </div>
  );
};

export default Calendar;
