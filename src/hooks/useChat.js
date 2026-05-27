import { useState, useMemo } from 'react';
import { parseWhatsAppText, getUniqueSenders } from '../utils/parser';
import { processZipUpload } from '../utils/zipHandler';
import { useDebounce } from './useDebounce';

// Helper to parse potential WhatsApp date strings into JS Date objects
const tryParseWaDate = (dateStr) => {
    // Try to normalize various formats to something Date() can parse.
    // Example dateStr: "12/05/26" or "2026-05-12"
    let parts = dateStr.split(/[/.-]/);
    if (parts.length === 3) {
        // If year is first (YYYY-MM-DD)
        if (parts[0].length === 4) {
            return new Date(`${parts[0]}-${parts[1]}-${parts[2]}`);
        }
        // If year is last (DD/MM/YY or MM/DD/YY)
        if (parts[2].length === 2) {
            parts[2] = `20${parts[2]}`; // assume 20xx
        }
        // Let JS try its best to parse MM/DD/YYYY or DD/MM/YYYY
        const d = new Date(`${parts[1]}/${parts[0]}/${parts[2]}`);
        if (!isNaN(d.getTime())) return d;
        const d2 = new Date(`${parts[0]}/${parts[1]}/${parts[2]}`);
        if (!isNaN(d2.getTime())) return d2;
    }
    return new Date(dateStr);
};

export const useChat = () => {
    const [messages, setMessages] = useState([]);
    const [senders, setSenders] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [jumpIndex, setJumpIndex] = useState(null);
    const [currentSearchIndex, setCurrentSearchIndex] = useState(0);

    // Debounce search query to prevent UI freezing
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const handleFileUpload = async (file) => {
        try {
            setError(null);
            
            if (file.name.endsWith('.zip')) {
                const result = await processZipUpload(file);
                setMessages(result.messages);
                setSenders(getUniqueSenders(result.messages));
                setIsLoaded(true);
            } else if (file.name.endsWith('.txt')) {
                const text = await file.text();
                // Use Web Worker for parsing large text files without blocking UI
                const worker = new Worker(new URL('../workers/parser.worker.js', import.meta.url), { type: 'module' });
                worker.onmessage = (e) => {
                    const { success, messages: parsedMessages, senders: parsedSenders, error: workerError } = e.data;
                    if (success) {
                        setMessages(parsedMessages);
                        setSenders(parsedSenders);
                        setIsLoaded(true);
                    } else {
                        setError(workerError || 'Failed to parse chat file.');
                    }
                    worker.terminate();
                };
                worker.onerror = (err) => {
                    setError('Error in parsing worker.');
                    console.error(err);
                    worker.terminate();
                };
                worker.postMessage({ text });
            } else {
                throw new Error('Unsupported file format. Please upload a .txt or .zip file.');
            }
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to parse chat file.');
        }
    };

    const reset = () => {
        setMessages([]);
        setSenders([]);
        setIsLoaded(false);
        setError(null);
        setSearchQuery('');
        setJumpIndex(null);
        setCurrentSearchIndex(0);
    };

    const { groupedMessages, dateIndexMap, availableDates, searchResults } = useMemo(() => {
        const grouped = [];
        const indexMap = {};
        const dates = [];
        let currentDate = null;
        let indexCounter = 0;
        const results = [];

        messages.forEach((msg, idx) => {
            // Group by date
            if (msg.date !== currentDate && !msg.isSystem) {
                currentDate = msg.date;
                dates.push(currentDate);
                grouped.push({
                    type: 'date',
                    date: currentDate,
                    id: `date-${currentDate}`
                });
                indexMap[currentDate] = indexCounter;
                indexCounter++;
            }
            
            const isFirstInGroup = idx === 0 || messages[idx - 1].sender !== msg.sender || messages[idx - 1].isSystem !== msg.isSystem;
            
            grouped.push({
                type: 'message',
                data: msg,
                isFirstInGroup,
                id: msg.id
            });

            // If we have a search query, track the index if it matches
            if (debouncedSearchQuery && !msg.isSystem) {
                if (msg.content.toLowerCase().includes(debouncedSearchQuery.toLowerCase())) {
                    results.push(indexCounter);
                }
            }

            indexCounter++;
        });

        // Reset search index when search query changes
        setCurrentSearchIndex(0);

        return { 
            groupedMessages: grouped, 
            dateIndexMap: indexMap, 
            availableDates: dates,
            searchResults: results
        };
    }, [messages, debouncedSearchQuery]);

    // Handle jumping to specific search results
    const handleNextSearchResult = () => {
        if (searchResults.length > 0) {
            const nextIndex = (currentSearchIndex + 1) % searchResults.length;
            setCurrentSearchIndex(nextIndex);
            setJumpIndex({ index: searchResults[nextIndex], timestamp: Date.now() });
        }
    };

    const handlePrevSearchResult = () => {
        if (searchResults.length > 0) {
            const prevIndex = currentSearchIndex - 1 < 0 ? searchResults.length - 1 : currentSearchIndex - 1;
            setCurrentSearchIndex(prevIndex);
            setJumpIndex({ index: searchResults[prevIndex], timestamp: Date.now() });
        }
    };

    const handleJumpToDate = (targetDateStr) => {
        if (!targetDateStr) return;

        // Try exact match first
        if (dateIndexMap[targetDateStr] !== undefined) {
            setJumpIndex({ index: dateIndexMap[targetDateStr], timestamp: Date.now() });
            return;
        }

        // If from native date picker (YYYY-MM-DD), we need to find the closest match
        const targetDateObj = new Date(targetDateStr);
        if (!isNaN(targetDateObj.getTime())) {
            let closestDate = null;
            let smallestDiff = Infinity;

            for (const waDate of availableDates) {
                const parsedWaDate = tryParseWaDate(waDate);
                if (!isNaN(parsedWaDate.getTime())) {
                    const diff = Math.abs(parsedWaDate.getTime() - targetDateObj.getTime());
                    if (diff < smallestDiff) {
                        smallestDiff = diff;
                        closestDate = waDate;
                    }
                }
            }

            if (closestDate && dateIndexMap[closestDate] !== undefined) {
                setJumpIndex({ index: dateIndexMap[closestDate], timestamp: Date.now() });
            }
        }
    };

    return {
        groupedMessages,
        availableDates,
        handleJumpToDate,
        jumpIndex,
        allMessages: messages,
        senders,
        isLoaded,
        error,
        searchQuery,
        setSearchQuery,
        searchResults,
        currentSearchIndex,
        handleNextSearchResult,
        handlePrevSearchResult,
        handleFileUpload,
        reset
    };
};
