# ARGUS Sovereign OS - Marketing Website

This is the standalone marketing website for ARGUS Sovereign OS, the world's first AI-native desktop operating system.

## Project Structure
- `index.html`: The main structural content.
- `style.css`: The styling, featuring a dark theme, glassmorphism, and responsive design.
- `script.js`: Handles scroll animations (Intersection Observer) and mobile navigation.

## Features
- **Premium Aesthetics**: Dark mode by default, glassmorphism cards, animated gradients.
- **Performant Animations**: CSS transitions and `@keyframes`, triggered by JS Intersection Observer.
- **Responsive**: Fully optimized for mobile, tablet, and desktop devices.
- **No Dependencies**: Pure HTML, CSS, and Vanilla JavaScript. Fast to load, easy to host.

## Customization
- **Theme Colors**: Can be modified in `style.css` via the CSS custom properties (`:root` block).
- **Typography**: Uses Google Fonts (Inter). Update the `<link>` tag in `index.html` to change.

## Deployment
Since this is a static site with no build tools required, it can be hosted directly on **GitHub Pages**, **Vercel**, **Netlify**, or any basic web server.

### GitHub Pages
1. Push this directory to your GitHub repository (e.g., `JanSteve/argus-website`).
2. Go to **Settings > Pages**.
3. Under "Source", select the branch containing these files (usually `main` or `master`) and save.
4. Your site will be live at `https://JanSteve.github.io/argus-website`.

### Local Testing
Simply open `index.html` in your web browser, or use a local server for a more accurate testing environment:
```bash
npx serve .
# or
python3 -m http.server
```

## License
© 2026 R Jan Steve Daniel
