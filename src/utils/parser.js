/**
 * Parses a raw WhatsApp chat export text into an array of message objects.
 */
export const parseWhatsAppText = (text) => {
    const lines = text.split('\n');
    const messages = [];
    let currentMessage = null;

    // Matches [12/05/26, 10:30:22 PM] Yadnesh: Hello
    const regex1 = /^\[(\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4}),\s(\d{1,2}:\d{2}(?::\d{2})?(?:\s[a-zA-Z]{2})?)\]\s(.*?):\s(.*)$/;
    // Matches [12/05/26, 10:30:22 PM] Messages and calls are end-to-end encrypted.
    const regex1Sys = /^\[(\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4}),\s(\d{1,2}:\d{2}(?::\d{2})?(?:\s[a-zA-Z]{2})?)\]\s(.*)$/;
    
    // Matches 12/05/26, 22:30 - Rahul: Hi
    const regex2 = /^(\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4}),\s(\d{1,2}:\d{2}(?::\d{2})?(?:\s[a-zA-Z]{2})?)\s-\s(.*?):\s(.*)$/;
    // Matches 12/05/26, 22:30 - Messages and calls are end-to-end encrypted.
    const regex2Sys = /^(\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4}),\s(\d{1,2}:\d{2}(?::\d{2})?(?:\s[a-zA-Z]{2})?)\s-\s(.*)$/;

    // Attachment matchers
    const attachedRegex = /^(.*?)\s\(file attached\)$/;

    lines.forEach((line) => {
        let match = line.match(regex1) || line.match(regex2);
        if (match) {
            if (currentMessage) messages.push(currentMessage);
            currentMessage = {
                id: Math.random().toString(36).substring(2, 9),
                date: match[1],
                time: match[2],
                sender: match[3],
                content: match[4].trim(),
                isSystem: false,
                attachment: null
            };
            return;
        }

        let sysMatch = line.match(regex1Sys) || line.match(regex2Sys);
        if (sysMatch) {
            if (currentMessage) messages.push(currentMessage);
            currentMessage = {
                id: Math.random().toString(36).substring(2, 9),
                date: sysMatch[1],
                time: sysMatch[2],
                sender: null,
                content: sysMatch[3].trim(),
                isSystem: true,
                attachment: null
            };
            return;
        }

        // Multiline message append
        if (currentMessage) {
            currentMessage.content += '\n' + line.trim();
        }
    });

    if (currentMessage) messages.push(currentMessage);

    // Post-process to extract attachments
    messages.forEach(msg => {
        if (!msg.isSystem) {
            const attMatch = msg.content.match(attachedRegex);
            if (attMatch) {
                msg.attachment = attMatch[1].trim();
                msg.content = ''; // Clear text if it's just indicating an attachment
            }
        }
    });

    return messages.filter(m => m.content !== '' || m.attachment !== null);
};

export const getUniqueSenders = (messages) => {
    const senders = new Set();
    messages.forEach(m => {
        if (!m.isSystem && m.sender) {
            senders.add(m.sender);
        }
    });
    return Array.from(senders);
};
