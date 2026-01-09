import React, { createContext, useContext, useState, useEffect } from 'react';

const StationContext = createContext();

export const useStation = () => useContext(StationContext);

export const StationProvider = ({ children }) => {
  const [station, setStation] = useState(null);

  useEffect(() => {
    // Load persisted session
    const stored = localStorage.getItem('kds_station');
    if (stored) {
        setStation(JSON.parse(stored));
    }
  }, []);

  const login = (stationData) => {
    setStation(stationData);
    localStorage.setItem('kds_station', JSON.stringify(stationData));
  };

  const logout = () => {
    setStation(null);
    localStorage.removeItem('kds_station');
  };

  return (
    <StationContext.Provider value={{ station, login, logout }}>
      {children}
    </StationContext.Provider>
  );
};
