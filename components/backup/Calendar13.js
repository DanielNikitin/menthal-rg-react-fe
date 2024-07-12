import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Calendar = () => {
  const [calendarData, setCalendarData] = useState([]);
  const [currentMonthData, setCurrentMonthData] = useState({});
  const [prevMonthData, setPrevMonthData] = useState({});
  const [nextMonthData, setNextMonthData] = useState({});

  const [availableTimesForMonth, setAvailableTimesForMonth] = useState([]);
  const [nextAvailableDate, setNextAvailableDate] = useState('');
  const [monthDates, setMonthDates] = useState([]);

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState([]);

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
          const availableTimes = resAvailableTimes.data.AvailableTimesForMonth || [];
          setAvailableTimesForMonth(availableTimes);

          const resPrevMonthData = await axios.get('http://localhost:3001/getpreviousmonthdata');
          setPrevMonthData(resPrevMonthData.data.previousMonthData);

          const resNextMonthData = await axios.get('http://localhost:3001/getnextmonthdata');
          setNextMonthData(resNextMonthData.data.nextMonthData);

          const nextAvailable = availableTimes.find(dateData => dateData.availableTimes.length > 0);
          if (nextAvailable) {
            setNextAvailableDate(nextAvailable.date);
          }

          // все дни текущего месяца yyyy-mm-dd
          const monthDates = availableTimes.map(dateData => dateData.date);
          setMonthDates(monthDates);

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
    const formattedMonth = String(month).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const selectedDate = `${year}-${formattedMonth}-${formattedDay}`;
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
    if (selectedTime.length === 0) {
      return (
        <div className="text-center">
          <p className="font-bold text-xl text-gray-300">There are no available spots for this day</p>
          <p className="font-thin text-md text-gray-50">Next available date:</p>
          <p className="font-thin text-md text-gray-50">{nextAvailableDate}</p>
        </div>
      );
    }

    const morningTimes = selectedTime.filter(time => parseInt(time.split(':')[0], 10) < 12);
    const dayTimes = selectedTime.filter(time => parseInt(time.split(':')[0], 10) >= 12);

    const renderTimes = (times) => {
      return times.map((time, index) => (
        <button
          key={index}
          className="rounded-full bg-gray-500 text-white p-3 m-2"
          onClick={() => handleTimeClick(time)}
        >
          {time}
        </button>
      ));
    };

    return (
      <div>
        {morningTimes.length > 0 && (
          <div>
            <h2 className="font-thin text-white mb-2 text-xl">Morning</h2>
            <div className="flex flex-wrap">
              {renderTimes(morningTimes)}
            </div>
          </div>
        )}
        {dayTimes.length > 0 && (
          <div>
            <h2 className="font-thin text-white mt-4 mb-2 text-xl">Day</h2>
            <div className="flex flex-wrap">
              {renderTimes(dayTimes)}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCalendarCells = () => {
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const daysInMonth = currentMonthData.currentNumberOfDays;
    const currentMonthIndex = currentMonthData.currentMonthIndex;

    const firstDayOfWeek = new Date(currentMonthData.currentYear, currentMonthIndex - 1, 1).getDay();
    const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    const today = new Date();
    const isCurrentMonth = today.getFullYear() === currentMonthData.currentYear && today.getMonth() + 1 === currentMonthData.currentMonthIndex;

    let cells = [];

    daysOfWeek.forEach((day, index) => {
      cells.push(<div key={`day-${index}`} className="text-center font-sora text-gray-500 text-lg/2">{day}</div>);
    });

    const prevMonthDays = prevMonthData.numberOfDays || 0;
    for (let i = startOffset - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const month = currentMonthIndex === 1 ? 12 : currentMonthIndex - 1;
      const year = currentMonthIndex === 1 ? currentMonthData.currentYear - 1 : currentMonthData.currentYear;

      cells.push(
        <div key={`prev-${day}`} className="text-center text-gray-700">
          {day}
        </div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {

      const isPastDay = isCurrentMonth && day < today.getDate();
      const isToday = isCurrentMonth && day === today.getDate();
     // const isFutureDay = isCurrentMonth && day &&  > today.getDate();

      const isSelected = selectedDate === `${currentMonthData.currentYear}-${String(currentMonthIndex).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      // Проверка, есть ли в массиве availableTimesForMonth объект, у которого для текущей даты пустой массив availableTimes
      const isEmptyDay = availableTimesForMonth.some(dateData => dateData.date === `${currentMonthData.currentYear}-${String(currentMonthIndex).padStart(2, '0')}-${String(day).padStart(2, '0')}` && dateData.availableTimes.length === 0);

      cells.push(
        <div
          key={`current-${day}`}
          className={`text-center cursor-pointer
          ${isToday && !isSelected ? 'rounded-full bg-gray-700 text-white/70' : ''} 
          ${isEmptyDay ? 'text-gray-600' : ''}
          ${isPastDay ? 'text-gray-600' : ''}
          ${isSelected ? 'rounded-full bg-gray-500' : ''}
          `}  // ${isFutureDay ? '' : ''}
          onClick={() => handleDateClick(day, currentMonthIndex, currentMonthData.currentYear)}
        >
          {day}
        </div>
      );
    }

    const nextMonthStart = 1;
    const nextMonthIndex = currentMonthIndex === 12 ? 1 : currentMonthIndex + 1;
    for (let i = cells.length, nextDay = nextMonthStart; i < 42; i++, nextDay++) {
      cells.push(
        <div
          key={`next-${nextDay}`}
          className="text-center text-orange-400 cursor-pointer"
          onClick={() => handleDateClick(nextDay, nextMonthIndex, currentMonthData.currentYear)}
        >
          {nextDay}
        </div>
      );
    }

    return cells;
  };

  return (
    <div className="w-[600px] h-full bg-gray-800 p-3">
      <div className="mt-20 bg-gray-800 flex flex-col justify-between
      h-[280px] shadow-[0_15px_10px_-10px_rgba(0,0,0,0.25)]">
        <div className="flex justify-between mb-3">
          <h1 className="text-xl font-thin">{currentMonthData.currentMonthName}</h1>
          <h1 className="text-xl font-thin">{nextMonthData.monthName}</h1>
        </div>
        <div className="flex-grow">
          <div className="grid grid-cols-7 gap-3 gap-x-14">
            {renderCalendarCells()}
          </div>
        </div>
        <div className="mt-12">
          {renderTimeButtons()}
        </div>
      </div>
    </div>
  );
  

};

export default Calendar;