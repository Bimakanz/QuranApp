import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

type BookmarkCategory = 'hadits' | 'doa' | 'dzikir' | 'surah';

/**
 * Persistent bookmark hook backed by AsyncStorage.
 * Usage: const { bookmarks, toggle, isBookmarked } = useBookmarks('hadits');
 */
export function useBookmarks(category: BookmarkCategory) {
    const STORAGE_KEY = `@bookmarks_${category}`;
    const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
    const [loaded, setLoaded] = useState(false);

    // Load from AsyncStorage on mount
    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEY)
            .then((raw) => {
                if (raw) {
                    const arr: string[] = JSON.parse(raw);
                    setBookmarks(new Set(arr));
                }
            })
            .catch(console.error)
            .finally(() => setLoaded(true));
    }, [STORAGE_KEY]);

    // Persist to AsyncStorage whenever bookmarks change (after initial load)
    useEffect(() => {
        if (!loaded) return;
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...bookmarks])).catch(console.error);
    }, [bookmarks, loaded, STORAGE_KEY]);

    const toggle = useCallback((id: string) => {
        setBookmarks((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    }, []);

    const isBookmarked = useCallback((id: string) => bookmarks.has(id), [bookmarks]);

    const add = useCallback((id: string) => {
        setBookmarks((prev) => new Set([...prev, id]));
    }, []);

    const remove = useCallback((id: string) => {
        setBookmarks((prev) => { const n = new Set(prev); n.delete(id); return n; });
    }, []);

    const clear = useCallback(() => setBookmarks(new Set()), []);

    return { bookmarks, toggle, isBookmarked, add, remove, clear, loaded };
}
