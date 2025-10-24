<p align="center">
</p>

<h1 align="center">Founders Club Website</h1>

<p align="center">
  <em>Empowering innovation at SRM through community, collaboration, and creation.</em>
</p>

<p align="center">
  <a href="https://www.thefoundersclub.in/" target="_blank">
    <img src="https://img.shields.io/badge/Visit%20Live%20Website-0078D7?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Website" />
  </a>
</p>

> **Empowering innovation at SRM through community, collaboration, and creation.**  
> A modern web platform for the **Founders Club @ SRM** — showcasing projects, events, and opportunities for aspiring student entrepreneurs.

---

## About Founders Club SRM

The Founders Club at SRM fosters a culture of innovation, entrepreneurship, and collaboration.
We organize events, hackathons, and incubator programs to empower the next generation of student founders.

---

## Tech Stack

- **Frontend:** Next.js, TailwindCSS, TypeScript  
- **Backend:** Supabase (PostgreSQL + Auth + Storage)  
- **DevOps:** Doppler (Secrets Management)  
- **Design:** Figma  

---

## Badges

<p align="center">
  <img src="https://img.shields.io/github/actions/workflow/status/founder-srm/Founders-website/deploy.yml?label=Build&style=for-the-badge" alt="Build Status" />
  <img src="https://img.shields.io/github/license/founder-srm/Founders-website?style=for-the-badge" alt="License" />
  <img src="https://img.shields.io/github/contributors/founder-srm/Founders-website?style=for-the-badge" alt="Contributors" />
  <img src="https://img.shields.io/github/issues/founder-srm/Founders-website?style=for-the-badge" alt="Issues" />
  <img src="https://img.shields.io/github/stars/founder-srm/Founders-website?style=for-the-badge" alt="Stars" />
</p>

---

## Demo & Visuals

> Showcase what the project looks and feels like!

<p align="center">
  <img src="assets/demo-homepage.png" width="800" alt="Homepage Screenshot" />
  <img src="assets/dashboard-preview.png" width="800" alt="Dashboard Screenshot" />
</p>

**Live Demo GIF:**  
_Add a short GIF of navigating through the website UI._

**Architecture Overview:**
```bash
Frontend (Next.js + Tailwind)
   │
   ├── Supabase (Auth, DB, Storage)
   │
   └── Sanity CMS (Content Management)
```

---

## Installation & Setup

### 1. Prerequisites

- Node.js (v18 or higher)
- Yarn or npm
- Supabase Access (_ask @greeenboi_)
- Doppler Access (_ask @greeenboi_)
- Recommended VSCode Extensions installed


### 2. Clone & Install

```bash
# Clone the repository
git clone https://github.com/founder-srm/Founders-website.git

# Move into the project directory
cd Founders-website

# Install dependencies
npm install
# or
bun install

# Run the development server
npm run dev
# or
bun dev

# Visit the app locally
http://localhost:3000

```

### 3. Setup & Configuration

1. Environment Variables

Create a `.env.local` file in the project root and add your credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_anon_key>
SANITY_PROJECT_ID=<your_sanity_project_id>
SANITY_DATASET=<your_sanity_dataset>
NEXT_PUBLIC_SITE_URL=https://www.thefoundersclub.in
```
[ NOTE: Never commit your .env file — it contains sensitive information. ]

2. Run the Application

After setting up environment variables, run:
```bash
npm run dev
```
The site will be live on your local environment.

---

## Contributing

We love open-source! Contributions are always welcome.

Please read the following before making a PR:
- Contributing Guidelines
- Code of Conduct

Quick Start for Contributors:
1. Fork this Repository.
2. Create a new branch for your feature/fix:
```bash
git checkout -b feature/your-feature-name
```
3. Commit your changes with a clear message:
```bash
git commit -m "Added: new component for homepage banner"
```
4. Push to your fork:
```bash
git push origin feature/your-feature-name
```
5. Open a Pull Request describing what you’ve changed.

---

## Troubleshooting
```bash
| Issue                     | Possible Fix                             |
| ------------------------- | ---------------------------------------- |
| Supabase auth not working | Check `.env` variables                   |
| Doppler not syncing       | Ensure Doppler CLI is logged in          |
| App not building          | Clear `.next` and reinstall dependencies |
| Static assets missing     | Run `npm run build` before deployment    |
```

---

## Community & Support

Join the Founders Club community to collaborate and innovate!
- [Official Website](https://www.thefoundersclub.in/)
- Contact us:

---
