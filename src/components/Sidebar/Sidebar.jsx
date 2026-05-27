import React from 'react';
import { Search, Calendar, ChevronUp, ChevronDown } from 'lucide-react';

const Sidebar = ({ 
    searchQuery, 
    setSearchQuery, 
    availableDates, 
    onJumpToDate, 
    searchResults, 
    currentSearchIndex, 
    onNextSearch, 
    onPrevSearch 
}) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--wa-bg-panel)', overflow: 'hidden' }}>
            
            {/* Header */}
            <div style={{ 
                height: '60px', 
                minHeight: '60px',
                backgroundColor: 'var(--wa-bg-panel-header)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '10px 16px',
                borderBottom: '1px solid var(--wa-border)'
            }}>
                <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    backgroundColor: '#6b7c85',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '14px'
                }}>ME</div>
            </div>

            {/* Search */}
            <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--wa-border)' }}>
                <div style={{ 
                    backgroundColor: 'var(--wa-bg-app)', 
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 12px',
                    height: '35px'
                }}>
                    <Search size={18} color="var(--wa-icon)" />
                    <input 
                        type="text" 
                        placeholder="Search messages..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            border: 'none',
                            backgroundColor: 'transparent',
                            color: 'var(--wa-text-primary)',
                            width: '100%',
                            outline: 'none',
                            padding: '0 12px',
                            fontSize: '14px'
                        }}
                    />
                    {searchResults && searchResults.length > 0 && searchQuery && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--wa-text-secondary)', fontSize: '12px' }}>
                            <span>{currentSearchIndex + 1} of {searchResults.length}</span>
                            <div style={{ display: 'flex', gap: '2px' }}>
                                <ChevronUp 
                                    size={18} 
                                    style={{ cursor: 'pointer', color: 'var(--wa-icon)' }} 
                                    onClick={onPrevSearch} 
                                />
                                <ChevronDown 
                                    size={18} 
                                    style={{ cursor: 'pointer', color: 'var(--wa-icon)' }} 
                                    onClick={onNextSearch} 
                                />
                            </div>
                        </div>
                    )}
                    {searchResults && searchResults.length === 0 && searchQuery && (
                        <span style={{ color: 'var(--wa-text-secondary)', fontSize: '12px', whiteSpace: 'nowrap' }}>0 results</span>
                    )}
                </div>
            </div>

            {/* Jump to Date Selector */}
            {availableDates && availableDates.length > 0 && (
                <div style={{ 
                    padding: '8px 12px', 
                    borderBottom: '1px solid var(--wa-border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <Calendar size={16} color="var(--wa-icon)" />
                    <input 
                        type="date"
                        onChange={(e) => onJumpToDate(e.target.value)}
                        style={{
                            flex: 1,
                            backgroundColor: 'var(--wa-bg-app)',
                            color: 'var(--wa-text-primary)',
                            border: '1px solid var(--wa-border)',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: '13px',
                            outline: 'none',
                            colorScheme: 'dark' // Good for WhatsApp dark mode default styling in many browsers
                        }}
                        title="Jump to date"
                    />
                </div>
            )}

            {/* Chat List (Exported Chat) */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    backgroundColor: 'var(--wa-bg-panel)', // Make it look active
                }}>
                    <div style={{ 
                        width: '48px', 
                        height: '48px', 
                        borderRadius: '50%', 
                        backgroundColor: '#00a884',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        marginRight: '16px'
                    }}>EX</div>
                    <div style={{ flex: 1, borderBottom: '1px solid var(--wa-border)', paddingBottom: '12px', marginTop: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontSize: '16px', color: 'var(--wa-text-primary)' }}>Exported Chat</span>
                            <span style={{ fontSize: '12px', color: 'var(--wa-icon-active)' }}>Now</span>
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--wa-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            Currently viewing parsed data
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
