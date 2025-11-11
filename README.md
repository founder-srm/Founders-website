<p align="center">
</p>

<h1 align="center">Founders Club Website</h1>

<p align="center">
  <em>Empowering innovation at SRM through community, collaboration, and creation.</em>
</p>

<p align="center">
  <a href="https://www.thefoundersclub.in/" >
    <img src="https://img.shields.io/badge/Visit%20Live%20Website-0078D7?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Website" />
  </a>
  <a href="https://dashboard.simpleanalytics.com/thefoundersclub.in">
    <img src="https://simpleanalyticsbadges.com/simpleanalytics.com?mode=dark&logo=teal&counter=false&radius=10" height="20px" alt="Website" />
  </a>
  <img src="https://github.com/founder-srm/Founders-website/actions/workflows/typecheck.yml/badge.svg" alt="Website" />
</p>
<p align="center">
  <img src="https://img.shields.io/github/license/founder-srm/Founders-website?style=for-the-badge" alt="License" />
  <img src="https://img.shields.io/github/contributors/founder-srm/Founders-website?style=for-the-badge" alt="Contributors" />
  <img src="https://img.shields.io/github/issues/founder-srm/Founders-website?style=for-the-badge" alt="Issues" />
  <img src="https://img.shields.io/github/stars/founder-srm/Founders-website?style=for-the-badge" alt="Stars" />
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

## Installation & Setup

### 1. Prerequisites

- Node.js (v22 or higher)
- Bun (recommended package manager) - [Installation Guide](https://bun.com/docs/installation)
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
bun install

# Run the development server
run bun dev --watch
# or
bun dev

# Visit the app locally
http://localhost:3000

```

### 3. Setup & Configuration

Run the Application

After setting up environment variables, run:
```bash
bun run dev --watch
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
git commit -m "Added: feature-description"
```
4. Push to your fork:
```bash
git push origin feature/your-feature-name
```
5. Open a Pull Request describing what you’ve changed.

---

## Troubleshooting

| Issue                     | Possible Fix                             |
| ------------------------- | ---------------------------------------- |
| Supabase auth not working | Check `.env` variables                   |
| Doppler not syncing       | Ensure Doppler CLI is logged in          |
| App not building          | Clear `.next` and reinstall dependencies |
| Static assets missing     | Run `run bun dev` before deployment      |

---

## Community & Support

Join the Founders Club community to collaborate and innovate!
- [Official Website](https://www.thefoundersclub.in/)
- Contact us: fc.dei@srmist.edu.in

---

## Contributors

Thanks to all these amazing people who have contributed to this repo :)

<a href="https://github.com/founder-srm/Founders-website/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=founder-srm/Founders-website" />
</a>

---
