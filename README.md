# 🎛️ Meld Studio Deck

A premium, customizable control interface designed specifically for **Meld Studio**. Take full command of your streaming and recording workflow with a sleek, high-performance dashboard.

![Meld Studio Deck UI](./public/screenshot.png)

## ✨ Features

- **🚀 Live Control Deck**: Pin your most-used scenes and controls for instant access.
- **💎 Mini Deck (Tray App)**: A dedicated, unobtrusive macOS menu bar app for quick actions without leaving your workflow.
- **🎬 Scene Management**: Seamlessly switch between scenes with real-time status feedback.
- **🔴 Stream & Record**: One-tap controls for starting/stopping your broadcast and recordings.
- **📊 System Health**: Monitor latency and streaming status at a glance.
- **📱 Responsive & Mini Sidebar**: Toggle between a full-featured sidebar and a condensed, space-saving view.
- **🌊 Glassmorphism UI**: A stunning, modern dark-mode aesthetic with smooth animations.

## 🛠️ Getting Started

### Prerequisites

- **Meld Studio**: Ensure Meld Studio is installed and running.
- **WebChannel API**: Enable the WebChannel API in Meld Studio settings (default port `13376`).
- **Node.js**: v18+ Recommended.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/meld-studio-deck.git
   cd meld-studio-deck
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Start the application:
   ```bash
   # Run the Electron App (Recommended)
   yarn dev:electron
   
   # Run Web Version only (for UI testing)
   yarn dev
   ```

## 🤝 Contributing

We welcome contributions! Whether you have ideas for new features, bug fixes, or UI improvements, we'd love to see your pull requests. 

1. **Fork the Project**
2. **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your Changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the Branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

Join us in building the best companion app for Meld Studio!

## 🔌 Connection

The app connects to Meld Studio via local WebSocket (`127.0.0.1:13376`). If the connection is lost, you'll see a status indicator and a "Launch Connection" button to retry.

## 📚 Resources

- **Official WebChannel API Documentation**: [Meld Studio WebChannelAPI.md](https://github.com/MeldStudio/streamdeck/blob/main/WebChannelAPI.md) - Learn more about building tools for Meld Studio.

## 📦 Tech Stack

- **Electron** (Desktop wrapper & Tray support)
- **Vue 3** (Composition API)
- **TypeScript**
- **Vite**
- **Tailwind CSS 4**
- **Lucide Icons**

## 📄 License

MIT
