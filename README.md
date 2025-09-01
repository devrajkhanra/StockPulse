# NSE Data Downloader

A professional, compact, and accessible web application for downloading, organizing, and managing National Stock Exchange (NSE) data files. Built with React, TypeScript, Vite, Tailwind CSS, and a Node.js/Express backend.

## Features

- **Bulk Downloads:** Download multiple NSE data sources and date ranges efficiently.
- **Real-time Progress:** Track download progress with live updates.
- **Organized Storage:** Files are automatically organized into structured directories.
- **Recent Downloads:** View and manage your download history.
- **Modern UI:** Compact, eye-soothing, and WCAG-compliant design.
- **No Authentication:** Fully open access for all users.

## Project Structure

```
StockPulse/
├── client/
│   ├── index.html
│   └── src/
│       ├── App.tsx                # Main app and router
│       ├── index.css              # Tailwind and custom styles
│       ├── main.tsx               # App entry point
│       ├── components/
│       │   ├── date-selection-panel.tsx
│       │   ├── download-queue.tsx
│       │   ├── recent-downloads-table.tsx
│       │   ├── status-panel.tsx
│       │   ├── theme-provider.tsx
│       │   └── ui/                # Reusable UI components
│       ├── hooks/
│       │   ├── use-mobile.tsx
│       │   ├── use-toast.ts
│       │   └── useAuth.ts         # Stub (no auth)
│       ├── lib/
│       │   ├── authUtils.ts       # (legacy, not used)
│       │   ├── date-utils.ts
│       │   ├── nse-api.ts
│       │   ├── queryClient.ts
│       │   └── utils.ts
│       └── pages/
│           ├── home.tsx           # Main app page
│           ├── landing.tsx        # Landing page
│           └── not-found.tsx      # 404 page
├── server/
│   ├── index.ts                   # Express app entry
│   ├── routes.ts                  # API routes
│   ├── storage.ts                 # In-memory storage
│   └── vite.ts                    # Vite dev/prod server integration
├── shared/
│   └── schema.ts                  # Shared types and validation
├── tailwind.config.ts             # Tailwind config
├── postcss.config.js              # PostCSS config
├── tsconfig.json                  # TypeScript config
├── vite.config.ts                 # Vite config
├── package.json                   # Project dependencies/scripts
└── README.md                      # (You are here)
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd StockPulse
   ```
2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```

### Development

1. **Start the development server:**
   ```sh
   npm run dev
   # or
   yarn dev
   ```
2. Open your browser at [http://localhost:5000](http://localhost:5000)

### Production

1. **Build the client:**
   ```sh
   npm run build
   # or
   yarn build
   ```
2. **Start the server:**
   ```sh
   npm start
   # or
   yarn start
   ```

## Usage

- **Landing Page:** Overview and "Get Started" button.
- **Home Page:**
  - Select a single date or date range.
  - Choose data sources (Nifty 50, Indices, Stocks, Market Activity, Options).
  - Configure download path and concurrency.
  - Start downloads and monitor progress in the queue.
  - View recent downloads and manage history.

## Accessibility & Design

- Compact layout with minimal vertical space.
- Eye-soothing, low-contrast color palette.
- All interactive elements are keyboard accessible.
- Sufficient color contrast for WCAG compliance.
- Responsive design for desktop and mobile.

## Customization

- **Colors:** Edit `client/src/index.css` for palette tweaks.
- **UI Components:** All UI is modular and can be customized in `client/src/components/ui/`.
- **API/Storage:** The backend uses in-memory storage by default; adapt `server/storage.ts` for persistent storage.

## License

MIT

---

_Made with ❤️ for the finance and open-source community._
