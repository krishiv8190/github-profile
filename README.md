
# GitHub Profile Replica

<p align="center">
  <img src="https://img.shields.io/badge/React-2026-blue?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Vite-Build%20Tool-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/CSS-Responsive-1572B6?logo=css3&logoColor=white" alt="CSS" />
</p>

<p align="center">
  A responsive GitHub profile replica built with React, Vite, and plain CSS, featuring API-driven profile data, repositories, and an interactive contribution calendar.
</p>

<p align="center">
  <a href="https://github-profile-uptime.netlify.app/">
    <strong>View Live Demo</strong>
  </a>
  ·
  <a href="https://github.com/krishiv8190/github-profile">
    <strong>Source Code</strong>
  </a>
</p>

<p align="center">
  <img src="https://visitor-badge.laobi.icu/badge?page_id=krishiv8190.github-profile&left_text=Repository%20visitors" alt="Repository visitor count" />
</p>

---

## Overview


A responsive GitHub profile interface built with React, Vite, and CSS, featuring API-driven profile data, repository listings, an interactive contribution calendar, and activity visualizations.

The application combines a GitHub-style interface with data fetched from public APIs, interactive contribution visualizations, responsive layouts, and loading states designed to provide a smooth browsing experience.

**Live Demo:** https://github-profile-uptime.netlify.app/

## Features

- **GitHub-style interface** — Profile layout, navigation tabs, repository listings, and activity sections.
- **API-driven profile data** — Retrieves public GitHub profile information.
- **Repository integration** — Displays repository information fetched from the GitHub API.
- **Contribution heatmap** — Visualizes daily contribution activity using a color-coded calendar.
- **Year selection** — Switch between available contribution years.
- **Interactive tooltips** — View contribution counts and dates by hovering over or focusing on calendar cells.
- **Activity overview** — Displays a contribution distribution chart and organization information.
- **Loading animations** — Skeleton loaders and loading states improve perceived responsiveness.
- **Error handling** — Provides feedback when contribution or organization data cannot be loaded.
- **Responsive design** — Adapts the layout for desktop, tablet, and mobile screens.
- **External navigation** — Links to the original GitHub profile and relevant repositories.

## Tech Stack

| Technology | Purpose |
|---|---|
| React | Component-based user interface |
| Vite | Development server and production build |
| JavaScript (ES6+) | Application logic and API integration |
| CSS3 | Styling, responsive layouts, and animations |
| Lucide React | Icons |
| GitHub REST API | Public profile, repository, and organization data |
| GitHub Contributions API | Contribution calendar data |
| Netlify | Application deployment |

## Getting Started

### Prerequisites

- Node.js
- npm
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/krishiv8190/github-profile.git
   ```

2. Navigate to the project directory:

   ```bash
   cd github-profile
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL displayed in your terminal, usually `http://localhost:5173`.

### Production Build

Create an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## API Integration and Data Handling

The application uses public APIs to retrieve GitHub profile information, repositories, organization data, and contribution calendar data.

The contribution heatmap is populated from the GitHub Contributions API, with support for selecting different years.

**Activity data limitation:** The Activity Overview chart and Contribution Activity feed currently use static reference data to reproduce the intended interface. The public GitHub API does not expose every detail required to recreate the complete contribution activity feed. These sections should not be interpreted as a fully live activity history.

No authentication is required for the public data used by this application.

## Project Structure

```text
github-profile/
├── public/
├── src/
│   ├── components/
│   │   ├── ContributionCalendar/
│   │   ├── Header/
│   │   ├── Profile/
│   │   └── ProfileTabs/
│   ├── hooks/
│   │   ├── useGitHubActivity.js
│   │   └── useGitHubContributions.js
│   ├── services/
│   │   └── githubApi.js
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── index.html
├── package.json
└── README.md
```

*The directory structure above is illustrative; component filenames and folders may vary in the current repository.*

## Deployment

The application is deployed on Netlify.

**Live URL:** https://github-profile-uptime.netlify.app/

To deploy your own version:

1. Fork or clone this repository.
2. Import the repository into Netlify.
3. Configure the build command as `npm run build`.
4. Set the publish directory to `dist`.
5. Deploy the application.

## Repository Visitor Counter

The visitor badge at the top uses an external visitor-counting service and identifies this repository using `krishiv8190.github-profile`.

The count may take time to update and depends on the external service. It is not the same as GitHub's private repository traffic analytics, and its accuracy and availability are not guaranteed.

## Author

**Krishiv Pandita**

- GitHub: [@krishiv8190](https://github.com/krishiv8190)
- LinkedIn: [krishiv8190](https://www.linkedin.com/in/krishiv8190)

---

<p align="center">
  Built with React and Vite.
</p>
