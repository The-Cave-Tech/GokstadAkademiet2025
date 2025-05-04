"use client";

import { useState, useEffect, useRef } from 'react';
import { DatePickerProps } from '@/types/personalInfo.types';

export function DatePicker({
  id,
  name,
  value,
  onChange,
  onBlur,
  placeholder = "DD.MM.ÅÅÅÅ",
  required = false,
  readOnly = false,
  className = "",
  "aria-describedby": ariaDescribedBy
}: DatePickerProps) {
  const [inputValue, setInputValue] = useState(value);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [showYearSelector, setShowYearSelector] = useState(false);
  const [showMonthSelector, setShowMonthSelector] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
 
  useEffect(() => {
    setInputValue(value);
    
    if (value) {
      const parsedDate = parseDate(value);
      if (parsedDate && !isNaN(parsedDate.getTime())) {
        setCurrentMonth(parsedDate);
      }
    }
  }, [value]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
        setShowYearSelector(false);
        setShowMonthSelector(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };
  
  const parseDate = (dateString: string): Date | null => {
    if (!dateString) return null;
    
    const parts = dateString.split('.');
    if (parts.length !== 3) return null;
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    
    const date = new Date(year, month, day);
    return date;
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Allow empty input
    if (!newValue) {
      setInputValue('');
      onChange('');
      return;
    }
    
    // Restrict to digits and dots only
    if (!/^[\d.]*$/.test(newValue)) {
      return;
    }
    
    setInputValue(newValue);
    onChange(newValue); // Pass all inputs to parent for validation
    
    // Update calendar view if input is a valid date
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(newValue)) {
      const parsedDate = parseDate(newValue);
      if (parsedDate && !isNaN(parsedDate.getTime())) {
        setCurrentMonth(parsedDate);
      }
    }
  };
  
  const handleBlur = () => {
    if (onBlur) {
      onBlur(inputValue);
    }
  };
  
  const handleDateSelect = (date: Date) => {
    const formattedDate = formatDate(date);
    setInputValue(formattedDate);
    onChange(formattedDate);
    setShowCalendar(false);
  };
  
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;
    
    const days = [];
 
    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }
 
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  const setMonth = (month: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), month, 1));
    setShowMonthSelector(false);
  };
  
  const setYear = (year: number) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
    setShowYearSelector(false);
  };
  
  // Format month name
  const getMonthName = (month: number): string => {
    const months = [
      'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
      'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'
    ];
    return months[month];
  };
  
  // Generate array of years
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    
    // Generate years from 1930 to current year
    for (let year = 1930; year <= currentYear; year++) {
      years.push(year);
    }
    
    return years.reverse(); // Most recent years first
  };
  
  // Generate array of months
  const generateMonths = () => {
    return Array.from({ length: 12 }, (_, i) => ({
      value: i,
      name: getMonthName(i)
    }));
  };
  
  // Year selector JSX
  const yearSelectorJSX = (
    <div className="bg-white border border-gray-200 p-2 rounded-md shadow-md max-h-60 overflow-y-auto">
      <div className="grid grid-cols-4 gap-1">
        {generateYears().map(year => (
          <button
            key={year}
            type="button"
            onClick={() => setYear(year)}
            className={`p-2 hover:bg-blue-100 rounded ${
              year === currentMonth.getFullYear() ? 'bg-blue-500 text-white' : ''
            }`}
          >
            {year}
          </button>
        ))}
      </div>
    </div>
  );
  
  // Month selector JSX
  const monthSelectorJSX = (
    <div className="bg-white border border-gray-200 p-2 rounded-md shadow-md">
      <div className="grid grid-cols-3 gap-1">
        {generateMonths().map(month => (
          <button
            key={month.value}
            type="button"
            onClick={() => setMonth(month.value)}
            className={`p-2 hover:bg-blue-100 rounded ${
              month.value === currentMonth.getMonth() ? 'bg-blue-500 text-white' : ''
            }`}
          >
            {month.name}
          </button>
        ))}
      </div>
    </div>
  );
  
  const calendarJSX = (
    <div 
      ref={calendarRef}
      className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-2 min-w-[280px]"
    >
      <div className="flex justify-between items-center mb-2">
        <button 
          type="button"
          onClick={previousMonth}
          className="p-1 text-gray-600 hover:text-gray-900"
          aria-label="Forrige måned"
        >
          &lt;
        </button>
        
        <div className="flex items-center gap-1">
          <button 
            type="button"
            onClick={() => {
              setShowMonthSelector(!showMonthSelector);
              setShowYearSelector(false);
            }}
            className="font-medium hover:bg-gray-100 px-2 py-1 rounded"
          >
            {getMonthName(currentMonth.getMonth())}
          </button>
          <button 
            type="button"
            onClick={() => {
              setShowYearSelector(!showYearSelector);
              setShowMonthSelector(false);
            }}
            className="font-medium hover:bg-gray-100 px-2 py-1 rounded"
          >
            {currentMonth.getFullYear()}
          </button>
        </div>
        
        <button 
          type="button"
          onClick={nextMonth}
          className="p-1 text-gray-600 hover:text-gray-900"
          aria-label="Neste måned"
        >
          &gt;
        </button>
      </div>
      
      {showYearSelector ? (
        yearSelectorJSX
      ) : showMonthSelector ? (
        monthSelectorJSX
      ) : (
        <div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Days of week headers */}
            {['Ma', 'Ti', 'On', 'To', 'Fr', 'Lø', 'Sø'].map((day, index) => (
              <div key={index} className="text-xs font-medium text-gray-500">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {generateCalendarDays().map((day, index) => (
              <div key={index} className="text-center">
                {day ? (
                  <button
                    type="button"
                    onClick={() => handleDateSelect(day)}
                    className={`w-8 h-8 flex items-center justify-center rounded-full hover:bg-blue-100 ${
                      value === formatDate(day) 
                        ? 'bg-blue-500 text-white hover:bg-blue-600' 
                        : ''
                    }`}
                  >
                    {day.getDate()}
                  </button>
                ) : (
                  <div className="w-8 h-8"></div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-2 text-right">
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                handleDateSelect(today);
              }}
              className="text-sm text-blue-500 hover:underline"
            >
              I dag
            </button>
          </div>
        </div>
      )}
    </div>
  );
  
  return (
    <div className="relative">
      <div className="flex items-center">
        <input
          id={id}
          name={name}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onFocus={() => !readOnly && setShowCalendar(true)}
          placeholder={placeholder}
          required={required}
          readOnly={readOnly}
          className={className}
          aria-describedby={ariaDescribedBy}
        />
        {!readOnly && (
          <button
            type="button"
            onClick={() => setShowCalendar(!showCalendar)}
            className="absolute right-3 text-gray-500"
            aria-label="Åpne kalender"
          >
            📅
          </button>
        )}
      </div>
      {showCalendar && !readOnly && calendarJSX}
    </div>
  );
}