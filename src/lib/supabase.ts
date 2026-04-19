import { createClient } from '@supabase/supabase-js';
import { CalendarEntry } from '@/types';

const supabaseUrl = 'https://vimhmfklifdcklfbtfsi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpbWhtZmtsaWZkY2tsZmJ0ZnNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MDc5MDksImV4cCI6MjA5MjE4MzkwOX0.NYSUB3DbOosqjorevM5XbS3WE-K_ykQteqY6Ls2FegI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Subscribe to real-time changes for calendar entries
export function subscribeToCalendarEntries(
  date: string,
  callback: (entries: CalendarEntry[]) => void
) {
  const channel = supabase
    .channel('calendar_entries_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'calendar_entries',
        filter: `date=eq.${date}`,
      },
      (payload) => {
        // Fetch updated entries when changes occur
        fetchEntriesForDate(date).then(callback);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// Fetch entries for a specific date
export async function fetchEntriesForDate(date: string): Promise<CalendarEntry[]> {
  const { data, error } = await supabase
    .from('calendar_entries')
    .select('*')
    .eq('date', date)
    .order('time', { ascending: true });

  if (error) {
    console.error('Error fetching entries:', error);
    return [];
  }

  return data || [];
}

// Add a new entry
export async function addEntry(entry: Omit<CalendarEntry, 'id' | 'createdAt'>) {
  const { data, error } = await supabase
    .from('calendar_entries')
    .insert({
      id: `${Date.now()}-${Math.random()}`,
      type: entry.type,
      content: entry.content,
      time: entry.time,
      created_by: entry.createdBy,
      date: entry.date,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding entry:', error);
    throw error;
  }

  return data;
}

// Delete an entry
export async function deleteEntry(entryId: string) {
  const { error } = await supabase
    .from('calendar_entries')
    .delete()
    .eq('id', entryId);

  if (error) {
    console.error('Error deleting entry:', error);
    throw error;
  }
}

// Fetch all entries for a month
export async function fetchEntriesForMonth(year: number, month: number): Promise<CalendarEntry[]> {
  const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month + 1).padStart(2, '0')}-31`;

  const { data, error } = await supabase
    .from('calendar_entries')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching month entries:', error);
    return [];
  }

  return data || [];
}
