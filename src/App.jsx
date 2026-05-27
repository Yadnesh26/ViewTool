import React, { useState } from 'react';
import { useChat } from './hooks/useChat';
import AppLayout from './components/Layout/AppLayout';
import Sidebar from './components/Sidebar/Sidebar';
import ChatArea from './components/Chat/ChatArea';
import UploadScreen from './components/Upload/UploadScreen';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {
    groupedMessages,
    availableDates,
    handleJumpToDate,
    jumpIndex,
    isLoaded,
    error,
    searchQuery,
    setSearchQuery,
    searchResults,
    currentSearchIndex,
    handleNextSearchResult,
    handlePrevSearchResult,
    handleFileUpload,
    senders
  } = useChat();

  if (!isLoaded) {
    return (
      <div className="app-container">
        <UploadScreen onUpload={handleFileUpload} error={error} />
      </div>
    );
  }

  return (
    <div className="app-container">
      <AppLayout 
        isSidebarOpen={isSidebarOpen}
        sidebar={
          <Sidebar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            availableDates={availableDates}
            onJumpToDate={handleJumpToDate}
            searchResults={searchResults}
            currentSearchIndex={currentSearchIndex}
            onNextSearch={handleNextSearchResult}
            onPrevSearch={handlePrevSearchResult}
            onCloseSidebar={() => setIsSidebarOpen(false)}
          />
        }
        chatArea={
          <ChatArea 
            groupedMessages={groupedMessages} 
            jumpIndex={jumpIndex}
            searchQuery={searchQuery}
            onOpenSidebar={() => setIsSidebarOpen(true)}
            senders={senders}
          />
        }
      />
    </div>
  );
}

export default App;
