'use client';

import { useState, useMemo, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn, formatDateKey } from '@/lib/utils';
import { CalendarEntry } from '@/types';
import SidePanel from './SidePanel';
import { fetchEntriesForMonth, addEntry as addEntryToSupabase, deleteEntry as deleteEntryFromSupabase } from '@/lib/supabase';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [entries, setEntries] = useState<Record<string, CalendarEntry[]>>({});
  const [loading, setLoading] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = useMemo(() => {
    const days = [];
    let day = startDate;
    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [startDate, endDate]);

  // Fetch entries when month changes
  useEffect(() => {
    const loadEntries = async () => {
      setLoading(true);
      try {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const monthEntries = await fetchEntriesForMonth(year, month);
        
        // Group entries by date
        const groupedEntries: Record<string, CalendarEntry[]> = {};
        monthEntries.forEach(entry => {
          if (!groupedEntries[entry.date]) {
            groupedEntries[entry.date] = [];
          }
          groupedEntries[entry.date].push(entry);
        });
        
        setEntries(groupedEntries);
      } catch (error) {
        console.error('Error loading entries:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEntries();
  }, [currentDate]);

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setIsSidePanelOpen(true);
  };

  const handleAddEntry = async (entry: CalendarEntry) => {
    try {
      await addEntryToSupabase(entry);
      // Refresh entries for the current month
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const monthEntries = await fetchEntriesForMonth(year, month);
      
      const groupedEntries: Record<string, CalendarEntry[]> = {};
      monthEntries.forEach(e => {
        if (!groupedEntries[e.date]) {
          groupedEntries[e.date] = [];
        }
        groupedEntries[e.date].push(e);
      });
      
      setEntries(groupedEntries);
    } catch (error) {
      console.error('Error adding entry:', error);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    try {
      await deleteEntryFromSupabase(entryId);
      // Refresh entries for the current month
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const monthEntries = await fetchEntriesForMonth(year, month);
      
      const groupedEntries: Record<string, CalendarEntry[]> = {};
      monthEntries.forEach(e => {
        if (!groupedEntries[e.date]) {
          groupedEntries[e.date] = [];
        }
        groupedEntries[e.date].push(e);
      });
      
      setEntries(groupedEntries);
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const getEntriesForDay = (day: Date): CalendarEntry[] => {
    const dateKey = formatDateKey(day);
    return entries[dateKey] || [];
  };

  const hasMeetings = (day: Date): boolean => {
    const dayEntries = getEntriesForDay(day);
    return dayEntries.some(e => e.type === 'Meeting');
  };

  const hasNotes = (day: Date): boolean => {
    const dayEntries = getEntriesForDay(day);
    return dayEntries.some(e => e.type === 'Note');
  };

  return (
    <div className="flex gap-6">
      <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handlePreviousMonth}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isDayToday = isToday(day);
            const dayEntries = getEntriesForDay(day);

            return (
              <button
                key={index}
                onClick={() => handleDayClick(day)}
                className={cn(
                  'relative p-3 rounded-xl transition-all hover:scale-105',
                  'min-h-[80px] flex flex-col items-start gap-1',
                  isCurrentMonth
                    ? 'bg-white dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-slate-700'
                    : 'bg-slate-50 dark:bg-slate-900/50 opacity-50',
                  isSelected && 'ring-2 ring-orange-500',
                  isDayToday && 'bg-orange-100 dark:bg-orange-900/30'
                )}
              >
                <span
                  className={cn(
                    'text-sm font-medium',
                    isCurrentMonth
                      ? 'text-slate-900 dark:text-white'
                      : 'text-slate-400',
                    isDayToday && 'text-orange-600 dark:text-orange-400'
                  )}
                >
                  {format(day, 'd')}
                </span>

                <div className="flex flex-col gap-1 w-full">
                  {dayEntries.slice(0, 2).map((entry) => (
                    <div
                      key={entry.id}
                      className={cn(
                        'text-xs px-1.5 py-0.5 rounded truncate',
                        entry.type === 'Meeting'
                          ? 'bg-orange-500 text-white'
                          : 'bg-blue-500 text-white'
                      )}
                    >
                      {entry.time}
                    </div>
                  ))}
                  {dayEntries.length > 2 && (
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      +{dayEntries.length - 2} more
                    </div>
                  )}
                </div>

                {hasMeetings(day) && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full" />
                )}
                {hasNotes(day) && !hasMeetings(day) && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <SidePanel
        isOpen={isSidePanelOpen}
        onClose={() => setIsSidePanelOpen(false)}
        selectedDate={selectedDate}
        entries={selectedDate ? getEntriesForDay(selectedDate) : []}
        onAddEntry={handleAddEntry}
        onDeleteEntry={handleDeleteEntry}
      />
    </div>
  );
}
