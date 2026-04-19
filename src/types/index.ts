export type EntryType = 'Meeting' | 'Note';

export interface CalendarEntry {
  id: string;
  type: EntryType;
  content: string;
  time: string; // HH:mm format
  createdBy: string;
  date: string; // ISO date string (YYYY-MM-DD)
  createdAt: string; // ISO timestamp
}

export interface DayEntries {
  date: string;
  entries: CalendarEntry[];
}

export interface CalendarState {
  selectedDate: Date | null;
  entries: Record<string, CalendarEntry[]>;
  isSidePanelOpen: boolean;
}
