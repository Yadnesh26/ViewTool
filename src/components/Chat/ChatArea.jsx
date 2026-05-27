import React, { useRef, useEffect } from 'react';
import { Search, MoreVertical } from 'lucide-react';
import { Virtuoso } from 'react-virtuoso';
import MessageBubble from './MessageBubble';

const ChatArea = ({ groupedMessages, jumpIndex, searchQuery, onOpenSidebar, senders }) => {
    const virtuosoRef = useRef(null);

    // Handle jumps to specific date index
    useEffect(() => {
        if (jumpIndex !== null && virtuosoRef.current) {
            virtuosoRef.current.scrollToIndex({
                index: jumpIndex.index,
                align: 'center',
                behavior: 'smooth'
            });
        }
    }, [jumpIndex]);

    const renderItem = (index, item) => {
        if (item.type === 'date') {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0' }}>
                    <div style={{ 
                        backgroundColor: 'var(--wa-message-system)', 
                        color: 'var(--wa-text-system)', 
                        padding: '6px 12px', 
                        borderRadius: '8px', 
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        boxShadow: '0 1px 0.5px rgba(11,20,26,.13)'
                    }}>
                        {item.date}
                    </div>
                </div>
            );
        } else {
            // Determine if message is sent by the primary user (right side)
            // We assume the first person in the chat is the "other" person (left side).
            // Everyone else (or just the second person) is "me" (right side).
            const isSent = (senders && senders.length > 0) ? (item.data.sender !== senders[0]) : false;

            return (
                <MessageBubble 
                    message={item.data} 
                    isFirstInGroup={item.isFirstInGroup} 
                    searchQuery={searchQuery}
                    isSent={isSent}
                />
            );
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
            
            {/* Header */}
            <div style={{ 
                height: '60px', 
                minHeight: '60px',
                backgroundColor: 'var(--wa-bg-panel-header)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '10px 16px',
                borderLeft: '1px solid rgba(255,255,255,0.05)',
                zIndex: 100
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '50%', 
                        backgroundColor: '#00a884',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '14px'
                    }}>EX</div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ color: 'var(--wa-text-primary)', fontSize: '16px', fontWeight: '500' }}>Exported Chat</span>
                        <span style={{ color: 'var(--wa-text-secondary)', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>
                            {groupedMessages.length} items loaded instantly
                        </span>
                    </div>
                </div>
                
                <div style={{ display: 'flex', gap: '20px', color: 'var(--wa-icon)' }}>
                    <Search size={20} style={{ cursor: 'pointer' }} onClick={onOpenSidebar} />
                    <MoreVertical size={20} style={{ cursor: 'pointer' }} />
                </div>
            </div>

            {/* Scrollable Message Area using Virtual Scrolling */}
            <div style={{ 
                flex: 1, 
                backgroundColor: 'var(--wa-bg-chat)', 
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* WhatsApp Wallpaper Pattern Overlay */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0.06,
                    pointerEvents: 'none',
                    backgroundImage: 'url("https://w0.peakpx.com/wallpaper/818/148/HD-wallpaper-whatsapp-background-cool-dark-green-new-theme-whatsapp.jpg")',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'repeat',
                    zIndex: 0
                }} />

                <div style={{ flex: 1, zIndex: 1, padding: '12px 0' }}>
                    {groupedMessages.length > 0 ? (
                        <Virtuoso 
                            ref={virtuosoRef}
                            data={groupedMessages}
                            itemContent={renderItem}
                            initialTopMostItemIndex={groupedMessages.length - 1}
                            style={{ height: '100%' }}
                        />
                    ) : (
                        <div style={{ color: 'var(--wa-text-secondary)', textAlign: 'center', marginTop: '20px' }}>
                            No messages found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatArea;
