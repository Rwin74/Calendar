'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, User, Plus, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { cn, formatDateKey, formatTime } from '@/lib/utils';
import { CalendarEntry, EntryType } from '@/types';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  entries: CalendarEntry[];
  onAddEntry: (entry: CalendarEntry) => void;
  onDeleteEntry: (entryId: string) => void;
}

export default function SidePanel({
  isOpen,
  onClose,
  selectedDate,
  entries,
  onAddEntry,
  onDeleteEntry,
}: SidePanelProps) {
  const [newEntryType, setNewEntryType] = useState<EntryType>('Meeting');
  const [newEntryContent, setNewEntryContent] = useState('');
  const [newEntryTime, setNewEntryTime] = useState('09:00');
  const [createdBy, setCreatedBy] = useState('Ortak 1');

  useEffect(() => {
    if (isOpen) {
      setNewEntryContent('');
      setNewEntryTime('09:00');
    }
  }, [isOpen]);

  const handleAddEntry = () => {
    if (!selectedDate || !newEntryContent.trim()) return;

    const newEntry: CalendarEntry = {
      id: `${Date.now()}-${Math.random()}`,
      type: newEntryType,
      content: newEntryContent,
      time: newEntryTime,
      createdBy,
      date: formatDateKey(selectedDate),
      createdAt: new Date().toISOString(),
    };

    onAddEntry(newEntry);
    setNewEntryContent('');
    setNewEntryTime('09:00');
  };

  const sortedEntries = [...entries].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full md:w-[480px] bg-white dark:bg-slate-800 shadow-2xl z-50 flex flex-col"
          >
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {selectedDate && format(selectedDate, 'd MMMM yyyy', { locale: tr })}
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => setNewEntryType('Meeting')}
                    className={cn(
                      'flex-1 py-2 px-4 rounded-lg font-medium transition-all',
                      newEntryType === 'Meeting'
                        ? 'bg-orange-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    )}
                  >
                    Meeting
                  </button>
                  <button
                    onClick={() => setNewEntryType('Note')}
                    className={cn(
                      'flex-1 py-2 px-4 rounded-lg font-medium transition-all',
                      newEntryType === 'Note'
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    )}
                  >
                    Not
                  </button>
                </div>

                <input
                  type="time"
                  value={newEntryTime}
                  onChange={(e) => setNewEntryTime(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />

                <input
                  type="text"
                  placeholder="Enter content..."
                  value={newEntryContent}
                  onChange={(e) => setNewEntryContent(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddEntry()}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />

                <button
                  onClick={handleAddEntry}
                  disabled={!newEntryContent.trim()}
                  className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {newEntryType === 'Meeting' ? 'Toplantı Ekle' : 'Not Ekle'}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {sortedEntries.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <CalendarIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
                  <p className="text-slate-500 dark:text-slate-400">
                    Bu gün için kayıt yok
                  </p>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                    Başlamak için bir toplantı veya not ekleyin
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sortedEntries.map((entry) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        'p-4 rounded-xl border-2',
                        entry.type === 'Meeting'
                          ? 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20'
                          : 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={cn(
                                'text-xs font-semibold px-2 py-1 rounded',
                                entry.type === 'Meeting'
                                  ? 'bg-orange-500 text-white'
                                  : 'bg-blue-500 text-white'
                              )}
                            >
                              {entry.type === 'Meeting' ? 'Toplantı' : 'Not'}
                            </span>
                            <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTime(entry.time)}
                            </span>
                          </div>
                          <p className="text-slate-900 dark:text-white font-medium mb-2">
                            {entry.content}
                          </p>
                          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {entry.createdBy}
                          </span>
                        </div>
                        <button
                          onClick={() => onDeleteEntry(entry.id)}
                          className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
