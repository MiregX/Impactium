import React from 'react'
import { CaptionLabel, DayPicker } from 'react-day-picker'
import s from './styles/Calendar.module.css';

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/ui/Button'
import { Icon } from '@impactium/icons'
import { ChevronLeft } from 'lucide-react';
import { ChevronRight } from 'lucide-react';

export type CalendarProps = React.ComponentProps<typeof DayPicker>
 
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(s.calendar, className)}
      classNames={{
        months: s.months,
        month: s.month,
        caption: s.caption,
        caption_label: s.caption_label,
        nav: s.nav,
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          s.nav_button
        ),
        nav_button_previous: s.nav_button_previous,
        nav_button_next: s.nav_button_next,
        table: s.table,
        head_row: s.head_row,
        head_cell: s.head_cell,
        row: s.row,
        cell: s.cell,
        day: cn(
          buttonVariants({ variant: "ghost" }),
          s.day
        ),
        day_range_end: s.day_range_end,
        day_selected: s.day_selected,
        day_today: s.day_today,
        day_outside: s.day_outside,
        day_disabled: s.day_disabled,
        day_range_middle: s.day_range_middle,
        day_hidden: s.day_hidden,
        ...classNames,
      }}
      components={{
        PreviousMonthButton: ({ ...props }) => <ChevronLeft className={s.icon} />,
        NextMonthButton: ({ ...props }) => <ChevronRight className={s.icon} />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"
 
export { Calendar }