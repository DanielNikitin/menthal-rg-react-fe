import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Calendar = () => {
  const [calendarData, setCalendarData] = useState([]);
  const [currentMonthData, setCurrentMonthData] = useState({});
  const [prevMonthData, setPrevMonthData] = useState([]);
  const [nextMonthData, setNextMonthData] = useState([]);

  const [dataFetched, setDataFetched] = useState(false);
  const [serverError, setServerError] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!dataFetched) {
          const resCalendarData = await axios.get('http://localhost:3001/getcalendardata');
          setCalendarData(resCalendarData.data.calendarData);

          const resMonthData = await axios.get('http://localhost:3001/getmonthdata');
          setCurrentMonthData(resMonthData.data.currentMonthData);

          const resPrevMonthData = await axios.get('http://localhost:3001/getpreviousmonthdata');
          setPrevMonthData(resPrevMonthData.data.previousMonthData);

          const resNextMonthData = await axios.get('http://localhost:3001/getnextmonthdata');
          setNextMonthData(resNextMonthData.data.nextMonthData);

          setDataFetched(true);
          setServerError(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setServerError(true);
      }
    };
  
    fetchData();
  }, [dataFetched]);
  
  if (serverError) {
    return <div>Server Temporary Not Working</div>;
  }
  
  // Функция для генерации ячеек календаря
  const renderCalendarCells = () => {
    const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    const daysInMonth = currentMonthData.currentNumberOfDays;

    // Получаем день недели первого числа месяца
    const firstDayOfWeek = new Date(currentMonthData.currentYear, currentMonthData.currentMonthIndex - 1, 1).getDay();
    const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    // Генерируем ячейки календаря
    let cells = [];

    // Добавляем заголовки дней недели
    daysOfWeek.forEach((day, index) => {
      cells.push(<div key={`day-${index}`} className="text-center text-white">{day}</div>);
    });

    // Заполняем ячейки числами предыдущего месяца
    const prevMonthDays = prevMonthData.numberOfDays;
    for (let i = startOffset - 1; i >= 0; i--) {
      cells.push(<div key={`prev-${i}`} className="text-center text-gray-500">{prevMonthDays - i}</div>);
    }

    // Заполняем ячейки числами текущего месяца
    for (let day = 1; day <= daysInMonth; day++) {
      cells.push(<div key={`current-${day}`} className="text-center">{day}</div>);
    }

    // Заполняем ячейки числами следующего месяца
    const nextMonthStart = 1;
    for (let i = cells.length, nextDay = nextMonthStart; i < 42; i++, nextDay++) {
      cells.push(<div key={`next-${i}`} className="text-center text-gray-500">{nextDay}</div>);
    }

    return cells;
  };

  return (
    <div className="w-[600px] h-[350px] bg-gray-800 p-5 rounded-xl absolute top-26 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-left text-lg font-roboto">{currentMonthData.currentMonthName} {currentMonthData.currentYear}</h1>
        <h1 className="text-white text-right">{currentMonthData.currentDay}</h1>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {renderCalendarCells()}
      </div>
    </div>
  );
};

export default Calendar;
