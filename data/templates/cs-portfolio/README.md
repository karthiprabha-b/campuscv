# CS Student Portfolio Template (Zero-Dependency)

A modern, responsive, high-performance Computer Science & AI student portfolio template built with **pure HTML5, CSS3, and Vanilla JavaScript**.

This template has **zero Node.js dependencies**, requires **no build step**, and requires **no `npm install`**. It can be opened directly in any browser or hosted on static hosting services like GitHub Pages, Netlify, Cloudflare Pages, or Vercel.

---

## 🚀 Features

- **Zero Build / Zero Node**: Pure static files (`index.html`, `css/styles.css`, `js/app.js`).
- **Modern Sleek Dark UI**: Curated slate color palette, subtle glassmorphism backdrop filters, glowing typography accents, and responsive layout.
- **Interactive Terminal Mockup**: Hero section includes an interactive `student_profile.json` code terminal object.
- **Project Showcase & Filter**: Filter projects by category (*All*, *Systems & C++*, *AI / ML*, *Web SaaS*).
- **Technical Architecture Modal**: Project cards include deep-dive modals detailing performance metrics, architecture, and accomplishments.
- **Printable Resume Viewer**: Interactive popup modal showcasing education, research, experience, and a direct "Print / Save PDF" feature.
- **Tabbed Experience / Education / Skills Matrix**: Seamless tab switching for Work Experience, Stanford Education & Coursework, and Skills Matrix.
- **Dark / Light Mode Toggle**: Built-in theme switching with local storage persistence.
- **Fully Responsive**: Mobile drawer navigation menu and optimized flex/grid views across mobile, tablet, and desktop screens.

---

## 📁 Directory Structure

```
cs-portfolio/
├── index.html        # Main HTML5 page structure
├── css/
│   └── styles.css    # Design system, CSS variables & component styles
├── js/
│   └── app.js        # Interactive JS logic (modals, filters, tabs, theme toggle)
├── public/           # Static assets (images, favicon, etc.)
└── README.md         # Template documentation
```

---

## 🛠️ How to Customize

1. **Personal Information**: Open `index.html` and edit the name, title, bio, education details, contact information, and social links.
2. **Projects Data**: Open `js/app.js` and modify the `projectsData` array to showcase your own projects, tech stack tags, live demo links, and GitHub repositories.
3. **Styles & Colors**: Open `css/styles.css` and adjust the `:root` CSS variables (`--primary`, `--bg-primary`, `--text-primary`) to match your preferred color scheme.

---

## 🌐 How to Host / Deploy

- **Local Preview**: Double-click `index.html` to open it in any web browser.
- **GitHub Pages**: Push this repository to GitHub, go to **Settings -> Pages**, and select the `main` branch root (`/`).
- **Netlify / Vercel**: Drag and drop this folder onto Netlify Drop or import the repository without specifying any build command.

---

## 📄 License

MIT License. Free to use and customize for personal or commercial portfolio sites.
