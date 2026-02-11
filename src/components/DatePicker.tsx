import React from 'react';
import { DayPicker } from 'react-day-picker';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { format } from 'date-fns';
import { Icon } from './Icon';
import { cn } from '@/utils/common';
import 'react-day-picker/dist/style.css';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      captionLayout="dropdown"
      startMonth={new Date(1970, 0)}
      endMonth={new Date(2050, 11)}
      className={cn("p-4 bg-white", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 pr-[21px] pl-[5px]",
        month: "space-y-4",
        month_caption: "flex justify-center pt-1 relative items-center px-8",
        caption_label: "text-sm font-semibold text-gray-900",
        nav: "space-x-1 flex items-center",
        button_previous: cn(
          "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg hover:bg-gray-100 absolute left-1 z-10"
        ),
        button_next: cn(
          "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg hover:bg-gray-100 absolute right-1 z-10"
        ),
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex",
        weekday: "text-gray-500 rounded-md w-9  text-[0.8rem] uppercase mb-2",
        week: "flex w-full mt-1",
        day: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
        day_button: cn(
          "h-9 w-9 p-0  aria-selected:opacity-100 hover:bg-primary hover:text-white rounded-xl transition-colors flex items-center justify-center"
        ),
        selected:
          "bg-primary text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white rounded-xl",
        today: "text-primary font-semibold bg-primary/10 rounded-xl",
        outside: "day-outside text-gray-400 opacity-50",
        disabled: "text-gray-400 opacity-50",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: (props) => {
          if (props.orientation === "left") {
            return <Icon name="chevron-left" size={16} className="text-primary" />;
          }
          return <Icon name="chevron-right" size={16} className="text-primary" />;
        },
      }}
      {...props}
    />
  );
}

interface DatePickerProps {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  containerClassName?: string;
  error?: string;
  disabled?: boolean;
}

export const DatePicker = ({
  date,
  onDateChange,
  placeholder = "Pick a date",
  label,
  className,
  containerClassName,
  error,
  disabled
}: DatePickerProps) => {
  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <label className="text-sm font-semibold text-gray-700 ml-1 block">
          {label}
        </label>
      )}
      <PopoverPrimitive.Root>
        <PopoverPrimitive.Trigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              "w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all bg-white text-base flex items-center justify-between text-left disabled:bg-gray-50 disabled:cursor-not-allowed group",
              error && "border-red-500 focus:ring-red-50",
              !date && "text-gray-400",
              className
            )}
          >
            <span className="truncate">
              {date ? format(date, "PPP") : placeholder}
            </span>
            <Icon 
              name="calendar" 
              size={18} 
              className={cn(
                "text-primary transition-colors",
                !disabled && "group-hover:text-primary/80"
              )} 
            />
          </button>
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            className="z-[100] w-auto p-0 bg-white rounded-2xl shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200"
            align="start"
            sideOffset={8}
          >
            <Calendar
              mode="single"
              selected={date}
              onSelect={onDateChange}
              initialFocus
            />
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
      {error && <span className="text-xs text-red-500 ml-1 mt-1 font-mediumm">{error}</span>}
    </div>
  );
};
