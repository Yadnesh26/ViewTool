# ViewTool - WhatsApp Chat Viewer

## Description
A high-performance, responsive React application designed to parse, view, and analyze exported WhatsApp chats (`.txt` and `.zip` formats). ViewTool is built with speed and user experience in mind, allowing you to instantly load massive chat histories and navigate them seamlessly.

## Features
- 🚀 **Lightning Fast Parsing**: Uses Web Workers to parse massive text files in the background without freezing the UI.
- 📜 **Virtual Scrolling**: Implemented with `react-virtuoso` to render hundreds of thousands of messages smoothly without lagging the browser.
- 🔍 **WhatsApp-Style Search**: Search for keywords without losing the context of the conversation. Matching text is highlighted, and you can jump seamlessly between matches using Up/Down navigation.
- 📅 **Smart Date Navigation**: Instantly jump to any specific date using a native calendar picker. If a date has no messages, the system automatically finds and jumps to the closest available date.
- 🖼️ **Media Support**: Automatically detects and handles image, video, and audio attachments if included in the export.
- 🎨 **Beautiful UI**: A dark-mode optimized, WhatsApp-style interface complete with message tails, sender colors, and checkmarks.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Yadnesh26/ViewTool.git
   cd ViewTool
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5173/` in your browser.

## Usage
1. Export a chat from WhatsApp (with or without media).
2. Upload the `.txt` or `.zip` file into ViewTool.
3. Use the search bar to find messages or the calendar to jump to specific dates.

## Tech Stack
- **Framework**: React 19 + Vite
- **Virtualization**: `react-virtuoso`
- **Icons**: `lucide-react`
- **Parsing**: Native JS Web Workers
