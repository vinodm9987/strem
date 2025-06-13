import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [audioInfo, setAudioInfo] = useState(null);
  const [supportedFormats, setSupportedFormats] = useState([]);

  // Fetch audio info and supported formats on component mount
  useEffect(() => {
    fetchAudioInfo();
    fetchSupportedFormats();
  }, []);

  const fetchAudioInfo = async () => {
    try {
      const response = await fetch('http://localhost:5000/audio-info');
      if (response.ok) {
        const info = await response.json();
        setAudioInfo(info);
        setError(''); // Clear any previous errors
      } else {
        const errorData = await response.json();
        setError(errorData.error);
      }
    } catch (err) {
      console.error('Failed to fetch audio info:', err);
      setError('Failed to connect to server');
    }
  };

  const fetchSupportedFormats = async () => {
    try {
      const response = await fetch('http://localhost:5000/supported-formats');
      if (response.ok) {
        const data = await response.json();
        setSupportedFormats(data.formats);
      }
    } catch (err) {
      console.error('Failed to fetch supported formats:', err);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const validateTimeFormat = (time) => {
    const regex = /^(\d+):([0-5]?\d)$/;
    return regex.test(time);
  };

  const parseTimeToSeconds = (timeStr) => {
    const [minutes, seconds] = timeStr.split(':').map(Number);
    return minutes * 60 + seconds;
  };

  const handleExtract = async () => {
    setError('');

    if (!validateTimeFormat(startTime) || !validateTimeFormat(endTime)) {
      setError('Please use MM:SS format (e.g., 1:30)');
      return;
    }

    const startSeconds = parseTimeToSeconds(startTime);
    const endSeconds = parseTimeToSeconds(endTime);

    if (startSeconds >= endSeconds) {
      setError('End time must be after start time');
      return;
    }

    if (audioInfo && endSeconds > audioInfo.duration) {
      setError(`End time exceeds audio duration (${formatTime(audioInfo.duration)})`);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/extract-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startTime,
          endTime,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to extract audio');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>🎵 Audio Extractor</h1>
        
        {audioInfo ? (
          <div className="audio-info">
            <h3>📁 Audio File Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <strong>File:</strong> {audioInfo.filename}
              </div>
              <div className="info-item">
                <strong>Format:</strong> {audioInfo.format}
              </div>
              <div className="info-item">
                <strong>Duration:</strong> {formatTime(audioInfo.duration)}
              </div>
              <div className="info-item">
                <strong>Bitrate:</strong> {audioInfo.bitrate}
              </div>
              <div className="info-item">
                <strong>Size:</strong> {audioInfo.size}
              </div>
            </div>
          </div>
        ) : !error && (
          <div className="loading-info">
            <p>🔍 Looking for audio files...</p>
          </div>
        )}

        {supportedFormats.length > 0 && (
          <div className="supported-formats">
            <details>
              <summary>📋 Supported Audio Formats</summary>
              <div className="formats-list">
                {supportedFormats.map(format => (
                  <span key={format} className="format-tag">{format}</span>
                ))}
              </div>
            </details>
          </div>
        )}

        <div className="form-group">
          <label>
            Start Time (MM:SS):
            <input
              type="text"
              placeholder="1:30"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              disabled={!audioInfo}
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            End Time (MM:SS):
            <input
              type="text"
              placeholder="2:05"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              disabled={!audioInfo}
            />
          </label>
        </div>

        <button 
          onClick={handleExtract} 
          disabled={loading || !audioInfo}
          className="extract-btn"
        >
          {loading ? 'Extracting...' : 'Extract Audio'}
        </button>

        {error && (
          <div className="error">
            {error}
            {!audioInfo && (
              <div className="error-help">
                <p><strong>To get started:</strong></p>
                <ol>
                  <li>Place your audio file in the <code>backend/audio/</code> folder</li>
                  <li>Supported formats: {supportedFormats.join(', ')}</li>
                  <li>Refresh this page</li>
                </ol>
              </div>
            )}
          </div>
        )}

        {audioUrl && (
          <div className="audio-player">
            <h3>Extracted Audio</h3>
            <audio controls src={audioUrl} />
            <br />
            <a href={audioUrl} download="extracted-audio.mp3">
              📥 Download Extracted Audio
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
