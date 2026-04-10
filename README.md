# 🎬 OTT Box - Premium Streaming Experience

<div align="center">
  <h3>⭐⭐ If you find this project useful, please consider giving it a STAR! ⭐⭐</h3>
  <p>It helps the algorithm and motivates me to add more enterprise features!</p>
</div>
<div align="center">
  <img src="./public/ott-banner.png" alt="OTT Box Banner" width="800" style="border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
  
  <br><br>
  
  <h3>✨ Stream Unlimited. Watch Anywhere. Enjoy Everything. ✨</h3>
  
  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js" alt="Next.js">
    <img src="https://img.shields.io/badge/React-19.2.3-blue?style=for-the-badge&logo=react" alt="React">
    <img src="https://img.shields.io/badge/TypeScript-5.0.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
    <img src="https://img.shields.io/badge/Supabase-Latest-green?style=for-the-badge&logo=supabase" alt="Supabase">
    <img src="https://img.shields.io/badge/TMDB_API-Integrated-yellow?style=for-the-badge" alt="TMDB API">
  </p>
</div>

---

## 🌟 **Project Overview**

**OTT Box** is a premium streaming platform that brings the cinema experience to your screen. Built with cutting-edge Next.js 16 and powered by TMDB API, it delivers a rich, immersive viewing experience with auto-playing trailers, dynamic content discovery, and a sleek Netflix-inspired interface.

### 🔥 **Hot New Features**

- 🔐 **Zero-Click QR Login** - Real-time Netflix-style WebSocket auth from mobile to desktop.
- 💌 **Premium Emailing** - Automated, custom-branded Welcome & Magic Link emails.
- 🛡️ **Secure Magic Links** - Advanced database checks to prevent ghost account creation.
- 🎬 **Shorts/Reels Feed** - Shorts/Reels-style vertical video feed for immersive trailer discovery.
- 🛡️ **Smart Watchlist** - Protected watchlist with authentication and easy management.
- 📱 **PWA Support** - Installable as a native app on all devices.
- 👆 **Touch Interactions** - Swipe, scroll, and long-press gestures optimization.

### 🎯 **Key Features**
 
- 🎥 **Auto-Playing Trailers** - Cinematic hero section with YouTube video backgrounds
- 📱 **Fully Responsive** - Seamless experience across all devices
- 🎭 **Premium UI/UX** - Netflix-style design with glassmorphism effects
- 🔍 **Smart Search** - Real-time content discovery across movies and TV shows
- 🎬 **Dynamic Categories** - Trending, Top Rated, Series, and Genre-based browsing
- ⚡ **Lightning Fast** - Server-Side Rendering with Next.js App Router
- 🎨 **Rich Animations** - Smooth transitions and interactive hover effects
- 📺 **Video Player** - Integrated streaming capabilities
- 🌐 **Multi-Content Support** - Movies, TV Series, Seasons, and Episodes

---

## 🚀 **Live Demo**

<div align="center">
  <a href="https://ott-box-weld.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/🌐_Live_Demo-Visit_Website-green?style=for-the-badge&logo=vercel" alt="Live Demo">
  </a>
  
  <br><br>
  
  <h4>🎯 <a href="https://ott-box-weld.vercel.app/" target="_blank">👉 Click Here to Visit Live Website 👈</a></h4>
  
  <p><strong>✨ Full streaming experience with unlimited content! ✨</strong></p>
  
  <br>
  
  <a href="https://github.com/SonuPaikrao/ottbox.git" target="_blank">
    <img src="https://img.shields.io/badge/📁_GitHub_Repository-View_Source-blue?style=for-the-badge&logo=github" alt="GitHub Repository">
  </a>
</div>

---

## 🛠️ **Tech Stack**

### **Frontend Framework**
- ⚛️ **Next.js 16** - Latest App Router with React Server Components
- 🎨 **React 19** - Server Components & Concurrent Features
- 📘 **TypeScript** - Full type safety throughout the application

### **Backend & Data**
- 🗄️ **Supabase** - Backend as a Service for user management
- 🎬 **TMDB API** - The Movie Database for content metadata
- 🔐 **Authentication** - Secure user authentication with Supabase

### **Styling & UI**
- 🎨 **Vanilla CSS** - Custom design system with CSS Modules
- ✨ **Glassmorphism** - Modern frosted glass UI effects
- 🔹 **Lucide React** - Beautiful, consistent iconography
- 🎭 **Smooth Animations** - CSS transitions and transforms

### **Video & Media**
- 📹 **Video.js** - Professional video player integration
- 🎥 **YouTube Embed** - Trailer playback in hero section
- 🖼️ **Next/Image** - Optimized image loading and caching

---

## 🏗️ **System Architecture**

Our architecture is designed to handle real-time concurrency, secure authentication, and edge-deployed frontend delivery.

### **System_Architecture_Map — Executive Overview**

<div align="center">
  <img src="./public/System_Architecture_Map.png" alt="System Architecture Map" width="100%" style="border-radius: 12px;">
</div>

This diagram presents the platform at an architectural level, focused on service responsibilities and runtime boundaries:

- **Edge-first frontend delivery**: Next.js 16 SSR/RSC is deployed on Vercel Edge for low-latency global rendering, static asset optimization, and CDN-assisted distribution.
- **Client intelligence at the edge**: Desktop browser and PWA/mobile clients maintain local capabilities (service worker, cache, playback state) to reduce round trips and improve UX continuity.
- **Real-time trust path**: Zero-click QR login bridges desktop and mobile through Supabase Auth + Realtime channels, enabling secure cross-device session initiation.
- **Core data domains**: User profiles, watchlist state, playback tracking, and search analytics are modeled as first-class backend domains for personalization and observability.
- **External provider integration**: TMDB powers metadata discovery, YouTube powers trailer/media surfaces, and SMTP/Nodemailer handles transactional communication.

### **System_Connectivity_Map — Operational Flow Overview**

<div align="center">
  <img src="./public/System_Connectivity_Map.png" alt="System Connectivity Map" width="100%" style="border-radius: 12px;">
</div>

This diagram explains how requests, auth events, and realtime signals move across layers in production:

- **Layered topology**: Client Edge -> Delivery (Vercel CDN) -> Application (Next.js App Router + API routes) -> Backend (Supabase services).
- **Zero-click auth choreography**: Desktop generates QR token, mobile scans and authenticates, backend validates and publishes session state, desktop completes login without manual credential entry.
- **API surface separation**: Dedicated routes for auth, analytics tracking, notifications/email, and search/view logging isolate concerns and simplify scaling.
- **Data and event pipelines**: Realtime streams handle instant state updates while relational tables persist durable entities like users, watchlist, and search logs.
- **Media + metadata routing**: Catalog intelligence (TMDB) and trailer delivery (YouTube) are integrated as upstream systems behind the application layer.

---

## 📦 **Installation & Setup**

### **Prerequisites**
- Node.js (v18 or higher)
- NPM or Yarn package manager
- Supabase account (free tier available)
- TMDB API key (free registration)

### **Quick Start**

```bash
# 1. Clone the repository
git clone https://github.com/SonuPaikrao/ottbox.git

# 2. Navigate to project directory
cd ott-box

# 3. Install dependencies
npm install

# 4. Setup environment variables
# Create .env.local file and add:
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 5. Start development server
npm run dev

# 6. Open in browser
# Visit http://localhost:3000
```

### **Environment Variables**

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

### **Authentication Setup (Important)**
To enable Google Sign-In:
1. Go to **Authentication > Providers** in Supabase Dashboard.
2. Enable **Google**.
3. **In Google Cloud Console**:
   - Create Credentials > OAuth Client ID.
   - **Application Type**: Select **Web application** (NOT Chrome Extension).
   - **Name**: "OttBox Web" or similar.
4. Add **Authorized redirect URIs** in Google Cloud: 
   - `https://wkfynjofytyfpvimlfno.supabase.co/auth/v1/callback`
### **Production & Vercel Setup**
When deploying to Vercel:
1. Go to **Supabase Dashboard > Authentication > URL Configuration**.
2. **Site URL**: Set this to your production URL (e.g., `https://ott-box-weld.vercel.app`).
3. **Redirect URLs**: Add the following:
   - `https://ott-box-weld.vercel.app/**`
   - `http://localhost:3000/**`
   
**Note**: You do NOT need to change anything in Google Cloud Console if you are using the Supabase Callback URL correctly. Just ensure Supabase allows your Vercel domain.


```

---

## 🎨 **Design Features**

### **Visual Design**
- 🎨 **Dark Cinema Palette** - Deep blacks (#0a0a0a), rich purples, and vibrant accents
- 🌟 **Hero Section** - Full-screen video background with auto-playing trailers
- 🎭 **Micro-Interactions** - Hover effects, scale transforms, and smooth transitions
- 📱 **Responsive Grid** - Adaptive layouts for all screen sizes
- 🔍 **Blur Effects** - Strategic use of backdrop filters for depth

### **Typography**
- 🎨 **Display Font** - Bold, cinematic headings
- 📝 **Body Font** - Clean, readable sans-serif
- 🎯 **Hierarchy** - Clear visual distinction between content types

---

## 📁 **Project Structure**

```
ottbox/
├── 📁 public/                    # Static assets, PWA files, architecture maps
│   ├── 🗺️ System_Architecture_Map.png
│   ├── 🗺️ System_Connectivity_Map.png
│   ├── 🎬 ott-banner.png
│   ├── 📄 manifest.json
│   ├── ⚙️ sw.js / workbox-*.js
│   └── 🎨 icons/, svg/jpg/png assets
├── 📁 src/
│   ├── 📁 app/                   # App Router: pages + route handlers
│   │   ├── 🏠 page.tsx            # Home
│   │   ├── 📁 api/               # REST endpoints (auth, track, logs, notifications)
│   │   ├── 🎬 movies/, 📺 series/, 🔥 trending/
│   │   ├── 🔍 search/, 🎞️ shorts/, ❤️ watchlist/
│   │   ├── 📖 title/[id]/, ▶️ watch/[id]/
│   │   ├── 🔐 auth/callback/, 📱 qr/
│   │   └── 🎨 layout.tsx, globals.css, loading/error boundaries
│   ├── 📁 components/            # Feature-organized UI modules
│   │   ├── Home/, Navbar/, Player/, Search/
│   │   ├── Title/, Shared/, Shorts/, Skeletons/, Analytics/
│   │   └── NotificationPopup.tsx
│   ├── 📁 context/               # Global state providers
│   │   ├── AuthContext.tsx
│   │   ├── WatchlistContext.tsx
│   │   ├── HistoryContext.tsx
│   │   └── ToastContext.tsx
│   ├── 📁 lib/                   # Integrations and utility services
│   │   ├── api.ts, tracker.tsx
│   │   ├── supabase.ts, supabase-browser.ts, supabase-admin.ts
│   │   └── email.ts, email-templates.ts
│   └── 📁 types/                 # Project type declarations
├── 📄 package.json                # Scripts and dependencies
├── 📄 next.config.ts              # Next.js runtime config
├── 📄 tsconfig.json               # TypeScript config
├── 📄 vercel.json                 # Deployment config
├── 📄 eslint.config.mjs           # Lint rules
├── 📄 *.sql                       # Supabase setup/migration scripts
├── 📄 .env                         # Local environment variables
└── 📄 README.md
```

---

## 🎯 **Key Components**

### **🎬 Hero Section**
- Full-screen video background with YouTube trailers
- Auto-rotation between trending content
- Smooth fade transitions between videos and images
- CTAs for "Play Now" and "More Info"

### **🎞️ Content Rows**
- Horizontally scrollable movie/series cards
- Categories: Trending Today, Top Rated, TV Series, By Genre
- Lazy loading for optimal performance
- Hover effects with scale and elevation

### **🔍 Search & Discovery**
- Real-time search across all content
- Genre-based filtering
- Advanced discovery with sort options
- Responsive grid layouts

### **📺 Video Player**
- Custom video player interface
- Episode selection for TV series
- Playback controls and settings
- Fullscreen support

---

## 🚀 **Deployment**

### **Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### **Environment Variables on Vercel**
Add the following environment variables in Vercel Dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### **GitHub Integration**
Connect your repository to Vercel for automatic deployments on every push.

---

## 🎬 **Content Categories**

### **🔥 Trending**
- Daily trending movies and TV shows
- Real-time updates from TMDB
- Personalized recommendations

### **⭐ Top Rated**
- Highest-rated films across all time
- Curated collections
- Award-winning content

### **📺 TV Series**
- Popular series with season tracking
- Episode-by-episode viewing
- Binge-worthy collections

### **🎭 By Genre**
- Action & Adventure
- Comedy & Drama
- Sci-Fi & Fantasy
- Horror & Thriller
- Romance & Animation

---

## 🤝 **Contributing**

We welcome contributions! Please follow these steps:

1. 🍴 **Fork** the repository
2. 🌿 **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. 📤 **Push** to the branch (`git push origin feature/amazing-feature`)
5. 🔄 **Open** a Pull Request

---

## 📄 **License**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 **Acknowledgments**

- 🎬 **TMDB** - For providing comprehensive movie and TV data
- 🗄️ **Supabase** - For backend infrastructure
- ⚛️ **Next.js Team** - For an amazing framework
- 🎨 **Design Inspiration** - Netflix, Disney+, and other streaming platforms

---

## 👨💻 **Developer**

<div align="center">
  
  **Developed with ❤️ by Sonu Rao**
  
  <br>
  
  <p>
    <a href="https://github.com/SonuPaikrao">💼 GitHub Profile</a>
  </p>
  
  <br>
  
  <p><strong>February 2026</strong></p>
  
</div>

---

<div align="center">
  
  <h3>🎬 Made for Movie & TV Enthusiasts 🍿</h3>
  
  <p>If you love this project, give it a ⭐ star!</p>
  
  <p><strong>Happy Streaming! 📺✨</strong></p>
  
</div>
