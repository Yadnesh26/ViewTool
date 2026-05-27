import { parseWhatsAppText, getUniqueSenders } from '../utils/parser';

self.onmessage = (e) => {
    try {
        const { text } = e.data;
        const messages = parseWhatsAppText(text);
        const senders = getUniqueSenders(messages);
        self.postMessage({ success: true, messages, senders });
    } catch (error) {
        self.postMessage({ success: false, error: error.message });
    }
};
