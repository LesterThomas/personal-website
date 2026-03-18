# Personal Website - Lester Thomas

A modern, responsive portfolio website showcasing presentations, articles, videos, podcasts, and social posts. Built with React 19, Vite 8, and Tailwind CSS, hosted on GitHub Pages.

🔗 **Live Site**: https://lesterthomas.github.io/personal-website

## Features

- **Content Portfolio**: 58+ presentations, articles, videos, podcasts, and social posts
- **Smart Filtering**: Search by keywords, filter by content type, and filter by tags
- **Timeline View**: Chronological view of all content grouped by year
- **Responsive Design**: Modern, minimal UI with cards and whitespace
- **Fast Performance**: Vite build optimization with code splitting
- **GitHub Pages**: Static hosting with automatic deployment via GitHub Actions

## Tech Stack

- **Frontend**: React 19.2.4
- **Build Tool**: Vite 8.0.0
- **Styling**: Tailwind CSS 3.4.1
- **Routing**: React Router 6.22.0 with HashRouter
- **Data Format**: YAML files (one per content item)
- **Icons**: Lucide React 0.344.0
- **Deployment**: GitHub Actions + GitHub Pages

## Project Structure

```
personal-website/
├── src/
│   ├── components/         # Reusable React components
│   │   ├── ContentCard.jsx
│   │   ├── FilterBar.jsx
│   │   └── Layout.jsx
│   ├── pages/             # Page components
│   │   ├── HomePage.jsx
│   │   ├── TimelinePage.jsx
│   │   └── AboutPage.jsx
│   ├── data/
│   │   └── content/       # YAML content files (58 items)
│   ├── utils/
│   │   └── contentLoader.js  # YAML loading utility
│   ├── App.jsx            # Main app with routing
│   ├── main.jsx           # App entry point
│   └── index.css          # Global styles + Tailwind
├── scripts/
│   └── scrape-linkedin.js  # Playwright scraper for LinkedIn activity
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Actions deployment workflow
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## Content Format

Each content item is stored as a separate YAML file in `src/data/content/`:

```yaml
title: "Article or presentation title"
type: article|presentation|video|podcast|social
date: YYYY-MM-DD
url: "https://external-link.com"
description: "Brief description (max 300 chars)"
publication: "Publication name"  # or event/source
tags:
  - ai
  - telecom
  - vodafone
featured: true
```

## Development

### Prerequisites

- Node.js 18+ 
- npm

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open http://localhost:5173/ in your browser.

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

### Scrape LinkedIn Activity

To pull in new posts from LinkedIn:

```bash
npm run scrape-linkedin
```

This opens a visible browser — sign in to LinkedIn, and the script will extract original posts and write YAML files to `src/data/content/`.

## Deployment

The site automatically deploys to GitHub Pages when you push to the `main` branch.

1. **Enable GitHub Pages** in your repository settings:
   - Go to Settings → Pages
   - Source: "GitHub Actions"

2. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Deploy website"
   git push origin main
   ```

3. **GitHub Actions** will automatically:
   - Build the app
   - Deploy to GitHub Pages
   - Site will be live at https://lesterthomas.github.io/personal-website

## Customization

### Update Colors

Edit `tailwind.config.js` to change the accent color:

```js
theme: {
  extend: {
    colors: {
      accent: '#aa3bff', // Change this
    },
  },
}
```

### Add Content

1. Create a new YAML file in `src/data/content/`
2. Follow the naming convention: `YYYY-MM-DD-title-slug.yml`
3. Use the content format shown above
4. The app will automatically load and display it

### Modify Layout

- **Navigation**: Edit `src/components/Layout.jsx`
- **Home Page Grid**: Edit `src/pages/HomePage.jsx`
- **Timeline Design**: Edit `src/pages/TimelinePage.jsx`
- **About Page**: Edit `src/pages/AboutPage.jsx`

## License

© 2025 Lester Thomas. All rights reserved.

## Contact

Dr Lester Thomas  
Head of New Technologies and Innovation, Vodafone Digital & IT  
https://www.linkedin.com/in/lester-thomas/

