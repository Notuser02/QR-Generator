import type { HistoryItem } from '../types/qr';

const STORAGE_KEY = 'qr_studio_history_v1';
const MAX_HISTORY_ITEMS = 30;

export function getHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load history from localStorage', err);
    return [];
  }
}

export function saveToHistory(item: Omit<HistoryItem, 'id' | 'timestamp'>): HistoryItem {
  const history = getHistory();
  
  const newItem: HistoryItem = {
    ...item,
    id: 'qr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    timestamp: Date.now(),
  };

  // Prevent duplicate payload with exact same rawPayload & title at top
  const filtered = history.filter(h => h.rawPayload !== newItem.rawPayload || h.title !== newItem.title);
  const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save history item to localStorage', err);
  }

  return newItem;
}

export function removeFromHistory(id: string): HistoryItem[] {
  const history = getHistory();
  const updated = history.filter(item => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete history item', err);
  }
  return updated;
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear history', err);
  }
}
