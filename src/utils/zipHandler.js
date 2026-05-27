import JSZip from 'jszip';
import { parseWhatsAppText } from './parser';

export const processZipUpload = async (file) => {
    const zip = new JSZip();
    const loadedZip = await zip.loadAsync(file);
    
    let chatText = null;
    let mediaMap = {}; // Maps filename to blob URL

    const fileNames = Object.keys(loadedZip.files);
    
    // First pass: find the .txt file and parse text
    for (const fileName of fileNames) {
        if (fileName.endsWith('.txt')) {
            chatText = await loadedZip.files[fileName].async('string');
        } else {
            // It's a media file (image, audio, video, etc.)
            // Note: we load as blob to generate object URLs
            const blob = await loadedZip.files[fileName].async('blob');
            mediaMap[fileName] = URL.createObjectURL(blob);
        }
    }

    if (!chatText) {
        throw new Error('No .txt file found in the uploaded zip.');
    }

    const messages = parseWhatsAppText(chatText);
    
    // Try to attach blob URLs to messages with attachments
    messages.forEach(msg => {
        if (msg.attachment) {
            // Find a match in mediaMap (sometimes filenames have extra spaces or diff casing)
            const exactMatch = mediaMap[msg.attachment];
            if (exactMatch) {
                msg.mediaUrl = exactMatch;
            } else {
                // Try fuzzy match
                const fuzzyKey = Object.keys(mediaMap).find(k => k.includes(msg.attachment));
                if (fuzzyKey) {
                    msg.mediaUrl = mediaMap[fuzzyKey];
                }
            }
        }
    });

    return { messages, mediaMap };
};
