# Safar - एक संगीतमय सफ़र 🎵

Safar is an immersive, beautifully crafted web-based music player that bridges three distinct eras of Indian cinema and music: **Sadaabahaar**, **Yaadein**, and **Naya Daur**. Built with modern web technologies, it features a seamless global audio player, persistent state management, and a stunning glassmorphic UI.

## ✨ Features

*   **Global Audio Player:** A persistent, floating media player that continues playing uninterrupted as you navigate between different musical eras.
*   **Dynamic Active Queue:** Add, remove, and play specific tracks dynamically. The queue separates your current playlist from the era's main library.
*   **Session Persistence:** Powered by `localStorage`, the app remembers your active queue, current track, and exact playback timestamp, picking up exactly where you left off even after a page refresh.
*   **Immersive UI/UX:** Cinematic full-screen video backgrounds, sleek glassmorphism overlays, and butter-smooth page transitions.
*   **Smart State Management:** Context API seamlessly orchestrates audio events, timeline seeking, track progression, and queue math without unnecessary re-renders.
*   **Fully Responsive:** Perfectly scaled and optimized for both desktop and mobile experiences.

## 🛠️ Tech Stack

*   **Frontend Framework:** React.js
*   **Build Tool:** Vite (for lightning-fast HMR and optimized builds)
*   **Styling:** Tailwind CSS (for utility-first, responsive glassmorphic design)
*   **Animations:** Framer Motion (for spring animations, dynamic card stacking, and page transitions)
*   **Icons:** Lucide React & Custom SVGs
*   **State Management:** React Context API & Local Storage

## 🚀 Installation & Setup

To run this project locally on your machine, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/safar-music-player.git](https://github.com/your-username/safar-music-player.git)

   Navigate to the project directory:

Bash
cd safar-music-player
Install the dependencies:

Bash
npm install
Start the development server:

Bash
npm run dev
The app will be available at http://localhost:5173.

📂 Project Structure
src/context/AudioContext.jsx - The global "brain" handling playback, queues, and local storage.

src/components/GlobalPlayer.jsx - The floating UI controller for active playback.

src/pages/ - Contains the main routing views (Home, Sadaabahaar, Yaadein, NayaDaur).

public/ - Houses the static assets including cover images, AI-generated background videos, and audio tracks.

👨‍💻 Author
Jay Pandya

AI & Data Science Engineer

Portfolio: jay-pandya.vercel.app

GitHub: https://github.com/Jay-176

LinkedIn: https://www.linkedin.com/in/jay-pandya-026022326/

Built with passion and a love for timeless music.

*(Note: Don't forget to swap out the dummy GitHub and LinkedIn links under the Author section with your actual profile URLs!)*

### Step 3: Push to GitHub
Now that your README is ready, you can push the entire project to GitHub. Open your VS Code terminal and run these commands:

```bash
# 1. Initialize Git
git init

# 2. Stage all files (including the new README)
git add .

# 3. Commit the code
git commit -m "Initial commit: Safar music player with persistent queue and README"

# 4. Link your repository (Replace with your actual GitHub repo URL)
git remote add origin https://github.com/your-username/safar-music-player.git

# 5. Push it to the main branch
git branch -M main
git push -u origin main