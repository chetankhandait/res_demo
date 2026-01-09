import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const TableContext = createContext();

export const useTable = () => useContext(TableContext);

export const TableProvider = ({ children }) => {
  const [tableId, setTableId] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const formatId = (id) => {
        if (!id) return null;
        let tid = id.trim().toUpperCase();
        // Auto-format "1" -> "T-001"
        if (/^\d+$/.test(tid)) {
            tid = `T-${tid.padStart(3, '0')}`;
        }
        return tid;
    };

    // Try to get from URL param "?table=T-001"
    const tableParam = searchParams.get('table');
    if (tableParam) {
      const formatted = formatId(tableParam);
      setTableId(formatted);
      localStorage.setItem('restaurant_table_id', formatted);
    } else {
      // Fallback to local storage if refreshed
      const stored = localStorage.getItem('restaurant_table_id');
      if (stored) {
          const formatted = formatId(stored);
           // If stored was "1", we update it to "T-001"
           if (formatted !== stored) {
               localStorage.setItem('restaurant_table_id', formatted);
           }
           setTableId(formatted);
      }
    }
  }, [searchParams]);

  return (
    <TableContext.Provider value={{ tableId, setTableId }}>
      {children}
    </TableContext.Provider>
  );
};
