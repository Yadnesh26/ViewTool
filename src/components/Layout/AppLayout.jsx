import React from 'react';

const AppLayout = ({ sidebar, chatArea }) => {
    return (
        <div style={{ display: 'flex', width: '100%', height: '100%' }}>
            <div style={{ width: '30%', minWidth: '300px', maxWidth: '400px', borderRight: '1px solid var(--wa-border)' }}>
                {sidebar}
            </div>
            <div style={{ flex: 1, minWidth: '400px' }}>
                {chatArea}
            </div>
        </div>
    );
};

export default AppLayout;
