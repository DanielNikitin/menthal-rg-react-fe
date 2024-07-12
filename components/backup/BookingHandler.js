import React, { createContext, useState } from 'react';

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookingData, setBookingData] = useState({
    specialist: null,
    service: null,
    date: null,
    time: null,
    personalInfo: {
      name: '',
      phone: '',
      email: '',
      comment: '',
      agreedToPrivacyPolicy: false
    }
  });

  return (
    <BookingContext.Provider value={{ bookingData, setBookingData }}>
      {children}
    </BookingContext.Provider>
  );
};
