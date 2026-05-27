import React from 'react';

const AppLayout = ({ sidebar, chatArea, isSidebarOpen }) => {
    return (
        <div className="app-layout-wrapper">
            <div className={`app-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                {sidebar}
            </div>
            <div className="app-chat-area">
                {chatArea}
            </div>
        </div>
    );
};

export default AppLayout;
