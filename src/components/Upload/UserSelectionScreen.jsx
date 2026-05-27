import React from 'react';
import { User } from 'lucide-react';

const UserSelectionScreen = ({ senders, onSelect }) => {
    // Generate avatar color based on name hash
    const getAvatarColor = (name) => {
        if (!name) return '#6b7c85';
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const h = Math.abs(hash) % 360;
        return `hsl(${h}, 70%, 40%)`;
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            padding: '2rem',
            backgroundColor: 'var(--wa-bg-app)',
            backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(0, 168, 132, 0.1) 0%, transparent 70%)',
        }}>
            <div style={{
                backgroundColor: 'rgba(32, 44, 51, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                padding: '3rem 2rem',
                maxWidth: '500px',
                width: '100%',
                textAlign: 'center',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
            }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: 'rgba(0, 168, 132, 0.1)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem auto'
                }}>
                    <User size={32} color="var(--wa-icon-active)" />
                </div>
                
                <h2 style={{ color: 'var(--wa-text-primary)', marginBottom: '0.5rem', fontSize: '1.5rem', fontWeight: '600' }}>
                    Who are you?
                </h2>
                <p style={{ color: 'var(--wa-text-secondary)', marginBottom: '2rem', fontSize: '0.95rem', lineHeight: '1.5' }}>
                    Select your name from the participants below. Your messages will be aligned to the right (green), and everyone else to the left.
                </p>

                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '12px',
                    maxHeight: '40vh',
                    overflowY: 'auto',
                    paddingRight: '4px' // scrollbar space
                }}>
                    {senders.map((sender, index) => (
                        <button
                            key={index}
                            onClick={() => onSelect(sender)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                padding: '16px',
                                backgroundColor: 'var(--wa-bg-panel)',
                                border: '1px solid var(--wa-border)',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                width: '100%',
                                outline: 'none'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(0, 168, 132, 0.1)';
                                e.currentTarget.style.borderColor = 'var(--wa-icon-active)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = 'var(--wa-bg-panel)';
                                e.currentTarget.style.borderColor = 'var(--wa-border)';
                            }}
                        >
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: getAvatarColor(sender),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                flexShrink: 0
                            }}>
                                {getInitials(sender)}
                            </div>
                            <span style={{ 
                                color: 'var(--wa-text-primary)', 
                                fontSize: '1rem', 
                                fontWeight: '500',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                {sender}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserSelectionScreen;
