import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BookingCalendarProps {
  onDateSelect?: (startDate: Date, endDate: Date) => void;
  blockedDates?: Date[];
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  onDateSelect,
  blockedDates = []
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const isSameDay = (date1: Date | null, date2: Date | null) => {
    if (!date1 || !date2) return false;
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const isDateBlocked = (date: Date) => {
    return blockedDates.some(blocked => isSameDay(blocked, date));
  };

  const isDateInPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isDateInRange = (date: Date) => {
    if (!startDate || !endDate) {
      if (startDate && hoveredDate && !isSameDay(startDate, date)) {
        const rangeStart = startDate < hoveredDate ? startDate : hoveredDate;
        const rangeEnd = startDate < hoveredDate ? hoveredDate : startDate;
        return date > rangeStart && date < rangeEnd;
      }
      return false;
    }
    return date > startDate && date < endDate;
  };

  const handleDateClick = (date: Date) => {
    if (isDateBlocked(date) || isDateInPast(date)) return;

    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else {
      if (date < startDate) {
        setEndDate(startDate);
        setStartDate(date);
      } else {
        setEndDate(date);
      }

      if (onDateSelect) {
        const finalStart = date < startDate ? date : startDate;
        const finalEnd = date < startDate ? startDate : date;
        onDateSelect(finalStart, finalEnd);
      }
    }
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const resetSelection = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const getDaysBetween = () => {
    if (!startDate || !endDate) return 0;
    const diff = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  const days = getDaysInMonth(currentMonth);
  const daysBetween = getDaysBetween();

  return (
    <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xl">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Select Rental Dates
        </h3>
        <p className="text-muted-foreground text-sm">
          Choose your start and end dates
        </p>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="text-lg font-bold text-foreground">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </div>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
          aria-label="Next month"
        >
          <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center text-xs font-bold text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} />;
          }

          const isStart = isSameDay(date, startDate);
          const isEnd = isSameDay(date, endDate);
          const isInRange = isDateInRange(date);
          const isBlocked = isDateBlocked(date);
          const isPast = isDateInPast(date);
          const isDisabled = isBlocked || isPast;

          const isSelected = isStart || isEnd;
          const availabilityLabel = isDisabled
            ? (isBlocked ? 'unavailable' : 'past date')
            : 'available';
          
          return (
            <motion.button
              key={date.toISOString()}
              onClick={() => handleDateClick(date)}
              onMouseEnter={() => setHoveredDate(date)}
              onMouseLeave={() => setHoveredDate(null)}
              disabled={isDisabled}
              whileHover={!isDisabled ? { scale: 1.1 } : {}}
              whileTap={!isDisabled ? { scale: 0.95 } : {}}
              aria-label={`${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}, ${availabilityLabel}`}
              aria-selected={isSelected}
              className={`
                aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all
                ${isStart || isEnd
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 z-10'
                  : isInRange
                  ? 'bg-primary/20 text-foreground'
                  : isDisabled
                  ? 'text-muted-foreground/30 cursor-not-allowed'
                  : 'hover:bg-secondary text-foreground'
                }
              `}
            >
              {date.getDate()}
            </motion.button>
          );
        })}
      </div>

      {/* Selection Info */}
      <AnimatePresence>
        {(startDate || endDate) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 pt-6 border-t border-border"
          >
            <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Start Date</div>
                  <div className="font-bold text-foreground">
                    {startDate?.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>
                {endDate && (
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">End Date</div>
                    <div className="font-bold text-foreground">
                      {endDate?.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                )}
              </div>
              {daysBetween > 0 && (
                <div className="text-center pt-3 border-t border-primary/20">
                  <span className="text-2xl font-bold text-primary">{daysBetween}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    {daysBetween === 1 ? 'day' : 'days'}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={resetSelection}
              className="w-full mt-4 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
            >
              Clear Selection
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary" />
            <span className="text-muted-foreground">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary/20" />
            <span className="text-muted-foreground">In Range</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-muted-foreground/10" />
            <span className="text-muted-foreground">Unavailable</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;
