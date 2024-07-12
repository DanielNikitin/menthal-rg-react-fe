import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Calendar = () => {
  const [calendarData, setCalendarData] = useState({});
  const [bookedTimes, setBookedTimes] = useState([]);
  const [serverError, setServerError] = useState(false); // Стейт для отслеживания ошибки сервера

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Получаем данные о доступных временах
        const response = await axios.get('http://localhost:3001/getfulldata');
        setCalendarData(response.data);

        // Получаем забронированные времена
        const bookedResponse = await axios.get('http://localhost:3001/bookedtimes');
        setBookedTimes(bookedResponse.data);

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

  const { currentMonthName, currentMonthIndex, currentYear, numberOfDays, currentDay } = calendarData;

  // Функция для определения имени дня недели по индексу (0 - воскресенье, 1 - понедельник, и т.д.)
  const getDayName = (index) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[index];
  };

  // Функция для генерации дат для отображения в календаре
  const generateDates = () => {
    // Проверяем наличие ошибки сервера
    if (serverError) {
      return []; // Возвращаем пустой массив, если есть ошибка сервера
    }

    // Получаем первый день недели для текущего месяца
    const firstDayOfWeek = new Date(currentYear, currentMonthIndex - 1, 1).getDay();
    const firstDayIndex = (firstDayOfWeek === 0) ? 6 : firstDayOfWeek - 1; // Преобразуем в индекс дня недели (0 - понедельник, 1 - вторник, и т.д.)
    
    // Определяем количество дней предыдущего месяца, которые будут отображены в календаре
    const prevMonthLastDay = new Date(currentYear, currentMonthIndex - 1, 0).getDate();
    const prevMonthDays = firstDayIndex; // Количество дней предыдущего месяца для отображения

    // Определяем количество дней текущего месяца
    const currentMonthDays = numberOfDays;

    // Определяем количество дней следующего месяца для отображения (заполняем до конца последней недели)
    const totalDays = prevMonthDays + currentMonthDays;
    const nextMonthDays = 35 - totalDays; // 35 - максимальное количество дней для отображения в календаре (7 дней * 5 недель)

    // Генерируем даты для отображения
    const dates = [];
    // Добавляем дни предыдущего месяца
    for (let i = prevMonthLastDay - prevMonthDays + 1; i <= prevMonthLastDay; i++) {
      dates.push({ date: i, isCurrentMonth: false });
    }
    // Добавляем дни текущего месяца
    for (let i = 1; i <= currentMonthDays; i++) {
      dates.push({ date: i, isCurrentMonth: true });
    }
    // Добавляем дни следующего месяца
    for (let i = 1; i <= nextMonthDays; i++) {
      dates.push({ date: i, isCurrentMonth: false });
    }

    return dates;
  };

  // Если есть ошибка сервера, отображаем сообщение
  if (serverError) {
    return <div>Server Temporary Not Working</div>;
  }

  return (
    <div className="w-[600px] h-[350px] bg-gray-800 p-5 rounded-xl absolute xl:top-16 sm:top-26 shadow-md">
      <h1 className="text-left text-lg font-roboto mb-4">{currentMonthName} {currentYear}</h1>
      <div className="grid grid-cols-7 gap-2">
        {/* Вывод дней недели */}
        {[0, 1, 2, 3, 4, 5, 6].map(index => (
          <div key={index} className="text-center text-white">{getDayName(index).slice(0, 3)}</div>
        ))}
        {/* Вывод дат */}
        {generateDates().map(({ date, isCurrentMonth }, index) => (
          <div key={index} className={`text-center ${isCurrentMonth ? 'text-white' : 'text-gray-400'}`}>{date}</div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
