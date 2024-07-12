import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Calendar = () => {
  const [calendarData, setCalendarData] = useState([]);
  const [currentMonthData, setCurrentMonthData] = useState({});
  const [prevMonthData, setPrevMonthData] = useState({});
  const [nextMonthData, setNextMonthData] = useState({});
  const [availableTimesForMonth, setAvailableTimesForMonth] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
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

          const resAvailableTimes = await axios.get('http://localhost:3001/getavailabletimes');
          setAvailableTimesForMonth(resAvailableTimes.data.AvailableTimesForMonth);

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

  const handleDateClick = (day, month, year) => {
    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;
    const selectedDate = `${year}-${month}-${day}`;
    setSelectedDate(selectedDate);
    const selectedDateData = availableTimesForMonth.find(dateData => dateData.date === selectedDate);
    if (selectedDateData) {
      const availableTimes = selectedDateData.availableTimes;
      setSelectedTime(availableTimes);
    } else {
      setSelectedTime([]);
    }
  };

  const handleTimeClick = (time) => {
    console.log(`Вы нажали на ${time} для даты ${selectedDate}`);
  };

  const renderTimeButtons = () => {
    return selectedTime.map((time, index) => (
      <button key={index} className="btn btn-primary mr-2" onClick={() => handleTimeClick(time)}>{time}</button>
    ));
  };

  // Функция для генерации ячеек календаря
  const renderCalendarCells = () => {
    const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    const daysInMonth = currentMonthData.currentNumberOfDays;
    const currentMonthIndex = currentMonthData.currentMonthIndex;

    // Получаем день недели первого числа месяца
    const firstDayOfWeek = new Date(currentMonthData.currentYear, currentMonthIndex - 1, 1).getDay();
    const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    const today = new Date();
    const isCurrentMonth = today.getFullYear() === currentMonthData.currentYear && today.getMonth() + 1 === currentMonthData.currentMonthIndex;

    // Генерируем ячейки календаря
    let cells = [];

    // Добавляем заголовки дней недели
    daysOfWeek.forEach((day, index) => {
      cells.push(<div key={`day-${index}`} className="text-center text-white">{day}</div>);
    });

    // Заполняем ячейки числами предыдущего месяца
    const prevMonthDays = prevMonthData.numberOfDays || 0;
    for (let i = startOffset - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const month = currentMonthIndex === 1 ? 12 : currentMonthIndex - 1;
      cells.push(
        <div
          key={`prev-${day}`}
          className="text-center text-gray-500 cursor-pointer"
          onClick={() => handleDateClick(day, month, currentMonthData.currentYear)}
        >
          {day}
        </div>
      );
    }

    // Заполняем ячейки числами текущего месяца
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = isCurrentMonth && today.getDate() === day;
      const isPastDay = isCurrentMonth && day < today.getDate() === day;
      cells.push(
        <div
          key={`current-${day}`}
          className={`text-center ${isToday ? 'rounded-full bg-gray-600/30' : ''} cursor-pointer`}
          onClick={() => handleDateClick(day, currentMonthIndex, currentMonthData.currentYear)}
        >
          {day}
        </div>
      );
    }

    // Заполняем ячейки числами следующего месяца
    const nextMonthStart = 1;
    const nextMonthIndex = currentMonthIndex === 12 ? 1 : currentMonthIndex + 1;
    for (let i = cells.length, nextDay = nextMonthStart; i < 42; i++, nextDay++) {
      cells.push(
        <div
          key={`next-${nextDay}`}
          className="text-center text-gray-500 cursor-pointer"
          onClick={() => handleDateClick(nextDay, nextMonthIndex, currentMonthData.currentYear)}
        >
          {nextDay}
        </div>
      );
    }

    return cells;
  };

  return (
    <div className="w-[600px] h-[350px] bg-gray-800 p-5 rounded-xl absolute top-20 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-left text-lg font-roboto">{currentMonthData.currentMonthName} {currentMonthData.currentYear}</h1>
        <h1 className="text-white text-right">{currentMonthData.currentDay}</h1>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {renderCalendarCells()}
      </div>
      {selectedTime.length > 0 && (
        <div className="mt-4">
          <h2 className="text-white mb-2">Available Times:</h2>
          {renderTimeButtons()}
        </div>
      )}
    </div>
  );
};

export default Calendar;