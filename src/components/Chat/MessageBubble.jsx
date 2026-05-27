import React from 'react';
import { CheckCheck } from 'lucide-react';

const MessageBubble = ({ message, isFirstInGroup, searchQuery, isSent }) => {
    
    // System messages (e.g. date changes or encryption notices)
    if (message.isSystem) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0' }}>
                <div style={{ 
                    backgroundColor: 'var(--wa-message-system)', 
                    color: 'var(--wa-text-system)', 
                    padding: '6px 12px', 
                    borderRadius: '8px', 
                    fontSize: '12px',
                    textAlign: 'center',
                    maxWidth: '80%',
                    boxShadow: '0 1px 0.5px rgba(11,20,26,.13)'
                }}>
                    {message.content}
                </div>
            </div>
        );
    }

    const align = isSent ? 'flex-end' : 'flex-start';
    const bgColor = isSent ? 'var(--wa-message-out)' : 'var(--wa-message-in)';
    
    // Colors for sender name based on hash
    let hash = 0;
    const sender = message.sender || '';
    for (let i = 0; i < sender.length; i++) {
        hash = sender.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = Math.abs(hash) % 360;
    const senderColor = `hsl(${h}, 70%, 60%)`;

    const renderContentWithHighlights = (content, query) => {
        if (!query) return content;
        
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const parts = content.split(new RegExp(`(${escapedQuery})`, 'gi'));
        
        return parts.map((part, index) => 
            part.toLowerCase() === query.toLowerCase() ? (
                <mark key={index} style={{ backgroundColor: 'var(--wa-icon-active)', color: '#fff', borderRadius: '2px', padding: '0 2px' }}>
                    {part}
                </mark>
            ) : (
                part
            )
        );
    };

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: align,
            marginBottom: '4px',
            padding: '0 5%'
        }}>
            <div style={{
                backgroundColor: bgColor,
                borderRadius: '7.5px',
                padding: '6px 7px 8px 9px',
                maxWidth: '65%',
                position: 'relative',
                boxShadow: '0 1px 0.5px rgba(11,20,26,.13)'
            }}>
                {/* Tail for first message in group */}
                {isFirstInGroup && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        [isSent ? 'right' : 'left']: '-8px',
                        width: '0',
                        height: '0',
                        borderTop: `10px solid ${bgColor}`,
                        [isSent ? 'borderRight' : 'borderLeft']: '10px solid transparent'
                    }} />
                )}

                {/* Sender Name */}
                {!isSent && isFirstInGroup && (
                    <div style={{ color: senderColor, fontSize: '12.5px', fontWeight: '500', marginBottom: '2px', lineHeight: '21px' }}>
                        {message.sender}
                    </div>
                )}

                {/* Media Attachment */}
                {message.mediaUrl && (
                    <div style={{ marginBottom: '4px', borderRadius: '4px', overflow: 'hidden' }}>
                        {message.attachment.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                            <img src={message.mediaUrl} alt="attachment" style={{ maxWidth: '100%', maxHeight: '300px', display: 'block' }} />
                        ) : message.attachment.match(/\.(mp4|webm)$/i) ? (
                            <video src={message.mediaUrl} controls style={{ maxWidth: '100%', maxHeight: '300px', display: 'block' }} />
                        ) : message.attachment.match(/\.(mp3|ogg|wav)$/i) ? (
                            <audio src={message.mediaUrl} controls style={{ maxWidth: '250px' }} />
                        ) : (
                            <div style={{ padding: '10px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '4px', display: 'flex', alignItems: 'center' }}>
                                <span style={{ fontSize: '13px', color: 'var(--wa-text-primary)' }}>📄 {message.attachment}</span>
                            </div>
                        )}
                    </div>
                )}
                
                {/* Missing media placeholder */}
                {message.attachment && !message.mediaUrl && (
                    <div style={{ padding: '10px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '4px', display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', color: 'var(--wa-text-secondary)', fontStyle: 'italic' }}>Media omitted ({message.attachment})</span>
                    </div>
                )}

                {/* Message Content */}
                {message.content && (
                    <div style={{ 
                        fontSize: '14.2px', 
                        lineHeight: '19px', 
                        color: 'var(--wa-text-primary)',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        marginRight: message.content.length < 20 ? '40px' : '0'
                    }}>
                        {renderContentWithHighlights(message.content, searchQuery)}
                    </div>
                )}

                {/* Metadata (Time & Ticks) */}
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    float: 'right',
                    marginTop: '-10px',
                    marginLeft: '8px',
                    position: 'relative',
                    bottom: '-4px'
                }}>
                    <span style={{ fontSize: '11px', color: 'var(--wa-text-secondary)' }}>{message.time}</span>
                    {isSent && <CheckCheck size={14} color="#53bdeb" />}
                </div>
                
                {/* Clearfix for float */}
                <div style={{ clear: 'both' }}></div>
            </div>
        </div>
    );
};

export default MessageBubble;
