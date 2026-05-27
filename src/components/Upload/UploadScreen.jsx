import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, Archive } from 'lucide-react';
import '../../App.css';

const UploadScreen = ({ onUpload, error }) => {
    const fileInputRef = useRef(null);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onUpload(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            onUpload(e.target.files[0]);
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="upload-screen">
            <div 
                className={`upload-box ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={triggerFileSelect}
            >
                <UploadCloud size={64} className="upload-icon" />
                <h2 className="upload-text">Upload WhatsApp Chat Export</h2>
                <p className="upload-subtext">Drag & drop your .txt or .zip file here, or click to browse.</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', color: 'var(--wa-text-secondary)', marginTop: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FileText size={20} />
                        <span>Text Only (.txt)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Archive size={20} />
                        <span>With Media (.zip)</span>
                    </div>
                </div>
                {error && <p className="error-text">{error}</p>}
                
                <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleChange}
                    accept=".txt,.zip,application/zip,text/plain"
                    className="hidden-input"
                />
            </div>
            <p style={{ marginTop: '2rem', color: 'var(--wa-text-secondary)', maxWidth: '500px', fontSize: '0.9rem' }}>
                Your chat is processed entirely in your browser. No data is sent to any server, ensuring 100% privacy and security.
            </p>
        </div>
    );
};

export default UploadScreen;
