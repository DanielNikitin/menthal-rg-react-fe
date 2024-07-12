import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Calendar = () => {
  const [calendarDataResponse, setCalendarDataResponse] = useState({});
  const [bookedTimes, setBookedTimes] = useState([]);
  const [serverError, setServerError] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Получаем данные о доступных временах
        const fullDataResponse = await axios.get('http://localhost:3001/getfulldata');
        setCalendarDataResponse(fullDataResponse.data);

        // Получаем забронированные времена
        const bookedTimesResponse = await axios.get('http://localhost:3001/bookedtimes');
        setBookedTimes(bookedTimesResponse.data);

        // Очищаем сообщение об ошибке, если запросы успешно завершены
        setServerError(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Устанавливаем сообщение об ошибке, если запросы не удалось выполнить
        setServerError(true);
      }
    };

    fetchData();
  }, []);

  const { currentMonthName, currentMonthIndex, currentYear, numberOfDays, currentDay } = calendarDataResponse;

  const getDayName = (index) => {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return daysOfWeek[index];
  };

  const generateDates = () => {
    if (serverError) {
      return [];
    }

    const firstDayOfWeek = new Date(currentYear, currentMonthIndex - 1, 1).getDay();
    const firstDayIndex = (firstDayOfWeek === 0) ? 6 : firstDayOfWeek - 1;
    
    const prevMonthLastDay = new Date(currentYear, currentMonthIndex - 1, 0).getDate();
    const prevMonthDays = firstDayIndex;

    const currentMonthDays = numberOfDays;

    const totalDays = prevMonthDays + currentMonthDays;
    const nextMonthDays = 35 - totalDays;

    const dates = [];
    for (let i = prevMonthLastDay - prevMonthDays + 1; i <= prevMonthLastDay; i++) {
      dates.push({ date: i, isCurrentMonth: false });
    }
    for (let i = 1; i <= currentMonthDays; i++) {
      dates.push({ date: i, isCurrentMonth: true });
    }
    for (let i = 1; i <= nextMonthDays; i++) {
      dates.push({ date: i, isCurrentMonth: false });
    }

    return dates;
  };


  const handleDateSelect = async (date) => {
    console.log('Selected Date:', `${date.toString().padStart(2, '0')}.${(currentMonthIndex).toString().padStart(2, '0')}.${currentYear}`);
  
    const currentDate = new Date(currentYear, currentMonthIndex, date);
    const today = new Date();
  
    // Если выбранная дата прошла, выводим сообщение
    if (currentDate < today) {
      console.log('No available times for selected date');
      return;
    }
  
    setSelectedDate(date);
    setSelectedMonth(currentMonthIndex);
  
    try {
      const fullDataResponse = await axios.get(`http://localhost:3001/getfulldata`);
      
      // Фильтрация временных данных для выбранной даты
      const selectedDateData = fullDataResponse.data.calendarData.filter(item => {
        // Преобразуем дату в формат YYYY-MM-DD для сравнения
        const itemDate = new Date(item.date);
        // Преобразование даты в формат YYYY-MM-DD
        const formattedDate = `${itemDate.getFullYear()}-${(itemDate.getMonth() + 1).toString().padStart(2, '0')}-${itemDate.getDate().toString().padStart(2, '0')}`;
  
        return formattedDate === `${currentYear}-${currentMonthIndex.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
      });
      
      if (selectedDateData.length === 0 || selectedDateData[0].times.length === 0) {
        console.log('No available times for selected date');
        setSelectedTimes([]); // Очищаем выбранные времена
      } else {
        setSelectedTimes(selectedDateData); // Сохраняем временные данные для выбранной даты
      }
    } catch (error) {
      console.error('Error fetching data for selected date:', error);
    }
  };
  
  
  
  

  if (serverError) {
    return <div>Server Temporary Not Working</div>;
  }

  return (
    <div className="w-[600px] h-full bg-gray-800 p-5 absolute top-32">
      <h1 className="text-left text-lg font-roboto mb-4">{currentMonthName} {currentYear}</h1>
      <div className="grid grid-cols-7 gap-2">
        {[0, 1, 2, 3, 4, 5, 6].map(index => (
          <div key={index} className="text-center text-white">{getDayName(index).slice(0, 3)}</div>
        ))}
        {generateDates().map(({ date, isCurrentMonth }, index) => (
          <div
            key={index}
            className={`text-center cursor-pointer ${isCurrentMonth ? 'text-white' : 'text-gray-400'}`}
            onClick={() => handleDateSelect(date, isCurrentMonth)}
          >
            <span className={`${isCurrentMonth && date === currentDay ? 'bg-gray-300/30 rounded-full p-2' : ''}`}>{date}</span>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <h2 className="text-white text-lg font-roboto mb-2">Available Times:</h2>
        <div className="flex flex-wrap gap-3">
          {selectedTimes.length > 0 ? (
            selectedTimes[0].times.map((time, index) => (
              <button key={index} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => console.log('Selected Time:', time)}>
                {time}
              </button>
            ))
          ) : (
            <span className="text-white">No available times for selected date</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;