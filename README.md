# 🎵 Song Extractor

A simple React and Node.js application that allows users to extract specific time segments from audio files and stream the extracted audio. Supports multiple audio formats including MP3, WAV, FLAC, M4A, AAC, OGG, and WMA.

## Features

- 🎵 **Multi-format support**: MP3, WAV, FLAC, M4A, AAC, OGG, WMA
- ⏱️ Extract audio segments by specifying start and end times (MM:SS format)
- 🎧 Stream extracted audio directly in the browser
- 📥 Download extracted audio files
- 📊 View detailed audio file information (format, bitrate, duration, size)
- 🎨 Modern, responsive UI with beautiful design
- ⚡ Real-time audio processing with FFmpeg
- 🔍 Automatic audio file detection

## Prerequisites

Before running this application, make sure you have:

- Node.js (v14 or higher)
- npm
- FFmpeg installed on your system

### Installing FFmpeg

**On Ubuntu/Debian:**

```bash
sudo apt update
sudo apt install ffmpeg
```

**On macOS (with Homebrew):**

```bash
brew install ffmpeg
```

**On Windows:**
Download from [FFmpeg official website](https://ffmpeg.org/download.html)

## Setup Instructions

1. **Clone or navigate to the project directory:**

   ```bash
   cd song-extractor
   ```

2. **Install dependencies for all parts:**

   ```bash
   npm run install-all
   ```

3. **Add your MP3 file:**

   - Place your MP3 file in `backend/audio/` folder
   - Rename it to `sample.mp3` or update the filename in `backend/server.js`

4. **Start the development servers:**
   ```bash
   npm run dev
   ```

This will start:

- Backend server on http://localhost:5000
- Frontend server on http://localhost:3000

## Usage

1. Open your browser and go to http://localhost:3000
2. You'll see the audio file information (filename and duration)
3. Enter start time in MM:SS format (e.g., "1:30")
4. Enter end time in MM:SS format (e.g., "2:05")
5. Click "Extract Audio"
6. Once processed, you can play the extracted audio or download it

## Project Structure

```
song-extractor/
├── backend/
│   ├── audio/          # Place your MP3 files here
│   ├── temp/           # Temporary extracted files
│   ├── server.js       # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx     # Main React component
│   │   └── App.css     # Styles
│   └── package.json
├── package.json        # Root package.json
└── README.md
```

## API Endpoints

- `GET /audio-info` - Returns audio file information
- `POST /extract-audio` - Extracts audio segment
  - Body: `{ "startTime": "1:30", "endTime": "2:05" }`

## Example Time Formats

- `0:30` - 30 seconds
- `1:30` - 1 minute 30 seconds
- `2:05` - 2 minutes 5 seconds
- `10:00` - 10 minutes

## Troubleshooting

1. **FFmpeg not found error:**

   - Make sure FFmpeg is installed and available in your PATH

2. **Audio file not found:**

   - Ensure your MP3 file is placed in `backend/audio/sample.mp3`

3. **CORS errors:**

   - Make sure both frontend (port 3000) and backend (port 5000) are running

4. **Port already in use:**
   - Change the port in the respective package.json files

## Notes

- Extracted audio files are temporarily stored and automatically cleaned up
- Supports MP3 input files
- Output is always in MP3 format
- Maximum extraction length depends on the source file duration
