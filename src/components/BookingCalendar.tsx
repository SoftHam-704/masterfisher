import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { ptBR } from "date-fns/locale";

interface BookingCalendarProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  disabledDates?: Date[];
}

const BookingCalendar = ({ selectedDate, onDateSelect, disabledDates = [] }: BookingCalendarProps) => {
  const [month, setMonth] = useState<Date>(new Date());

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) return true;
    
    return disabledDates.some(
      (disabledDate) =>
        disabledDate.toDateString() === date.toDateString()
    );
  };

  return (
    <div className="flex justify-center">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onDateSelect}
        month={month}
        onMonthChange={setMonth}
        locale={ptBR}
        disabled={isDateDisabled}
        className="rounded-md border shadow-sm"
      />
    </div>
  );
};

export default BookingCalendar;
