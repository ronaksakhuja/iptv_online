# IPTV Client

A macOS desktop IPTV client built with Tauri + React + TypeScript for Xtream Codes servers.

## Features

- **Direct streaming** - No proxy, streams directly from Xtream server
- **Channel browsing** - Browse channels by category
- **Search** - Quick channel search functionality
- **Clean UI** - Simple, native-looking interface
- **Persistent credentials** - Saves server configuration locally

## Prerequisites

Before running this app, make sure you have:

1. **Node.js** (v18 or higher)
2. **Rust** (latest stable) - [Install from rustup.rs](https://rustup.rs/)
3. **Xcode Command Line Tools** (macOS) - Run: `xcode-select --install`

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Development

Run the development server:

```bash
npm run tauri:dev
```

This will start both the Vite dev server and the Tauri app.

## Building

Build the production app:

```bash
npm run tauri:build
```

The built app will be in `src-tauri/target/release/bundle/`.

## Usage

1. Launch the app
2. Enter your Xtream Codes server details:
   - **Server URL**: e.g., `http://example.com:8080`
   - **Username**: Your Xtream username
   - **Password**: Your Xtream password
3. Click "Connect"
4. Browse channels and start watching!

## Configuration

Server credentials are saved locally in localStorage for convenience. Click "Logout" to clear saved credentials.

## Tech Stack

- **Tauri 2.x** - Desktop framework
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool

## Architecture

- **No backend** - Pure client-side application
- **No stream proxying** - Videos play directly from Xtream server URLs
- **Local storage** - Credentials stored in browser localStorage
- **Direct API calls** - All requests go directly to Xtream server

## Troubleshooting

### Video not playing

- Ensure your browser/system supports the stream format (usually .ts files)
- Check that the Xtream server is accessible
- Verify your credentials are correct

### Build errors

- Make sure Rust is installed: `rustc --version`
- Make sure Xcode CLI tools are installed (macOS)
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

## License

MIT
