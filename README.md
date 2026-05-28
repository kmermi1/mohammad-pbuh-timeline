# Sīrah — A Visual Chronicle of the Life of the Prophet Muhammad ﷺ

An interactive single-page website that visualizes:

- **A relationship graph** of 100 well-known figures from the time of the Prophet ﷺ — family, wives, children, the Rightly-Guided Caliphs, companions, opponents, and allies.
- **A chronological timeline** of the major events of his life, from the Year of the Elephant (570 CE) to the Farewell Pilgrimage and his death (632 CE).

Click any node to read a short biography and jump to related figures. Drag nodes, search by name, filter by category, and scroll down to read the chronicle.

---

## Project structure

```
prophet-site/
├── index.html      ← page markup
├── styles.css      ← all styling (parchment / illuminated-manuscript feel)
├── data.js         ← the 100 people, their relationships, and the timeline events
├── app.js          ← D3 force-graph + timeline rendering
└── README.md
```

**Everything is static HTML/CSS/JS** — no build step, no server, no dependencies to install. D3.js loads from a CDN.

---

## How to run it locally

You can just **double-click `index.html`** and it will open in your browser. That's it.

If for some reason fonts or D3 don't load, run a tiny local server (any of these works):

```bash
# Python (pre-installed on Mac/Linux)
python3 -m http.server 8000

# OR Node
npx serve .
```

Then open `http://localhost:8000`.

---

## Hosting it free on GitHub Pages

GitHub Pages will give you a free `https://<your-username>.github.io/<repo-name>/` URL. Steps:

### 1. Create a GitHub account
If you don't have one yet: <https://github.com/signup>

### 2. Create a new repository
- On GitHub, click the **+** in the top-right → **New repository**
- Name it something like `sirah` or `prophet-muhammad-timeline`
- Make it **Public** (required for free GitHub Pages)
- Tick **Add a README file** (you can replace it later)
- Click **Create repository**

### 3. Upload the files
The easiest way (no command line needed):

- On the repo page click **Add file → Upload files**
- Drag in **`index.html`**, **`styles.css`**, **`data.js`**, **`app.js`** (and `README.md` if you want)
- Scroll down and click **Commit changes**

### 4. Turn on GitHub Pages
- In the repository, click the **Settings** tab
- In the left sidebar click **Pages**
- Under **Source**, choose:
  - **Branch:** `main`
  - **Folder:** `/ (root)`
- Click **Save**

After a minute or so, GitHub will publish the site and show the URL at the top of the same Pages settings screen. It will look like:

```
https://<your-username>.github.io/<repo-name>/
```

That's your live site. Share that URL with anyone.

### 5. Updating the site later
Every time you commit a change to the `main` branch (edit a file on GitHub, or push from your computer), the site rebuilds automatically within a minute.

---

## Editing the content

### Adding or correcting a person
Open `data.js` and add an object to the `PEOPLE` array:

```js
{
  id: "someuniqueid",
  name: "Display Name",
  arabic: "الاسم",
  category: "companion",            // family | wife | child | grandchild |
                                    // caliph | companion | opponent | ally
  born: 590,
  died: 650,
  description: "One or two sentence biography."
}
```

Then add their relationships to the `RELATIONSHIPS` array:

```js
{ source: "someuniqueid", target: "muhammad", type: "companion" },
```

Supported relationship types: `parent`, `spouse`, `sibling`, `uncle`, `aunt`, `cousin`, `adopted`, `nursed_by`, `companion`, `close_companion`, `ally`, `opponent`.

### Adding a timeline event
Add an entry to the `EVENTS` array (keep them in chronological order):

```js
{ year: 624, age: 54, title: "Battle of Badr", body: "Description…" }
```

Reload the page and the changes appear immediately.

---

## A note on the content

Historical dates in early Islamic history vary slightly across sources (Ibn Ishaq, Ibn Hisham, Ibn Sa'd, al-Tabari, etc.). The dates here are reasonable midpoints. Treat this as a starting scaffold and refine entries from sources you trust.

---

## License

You're free to use, modify, and re-host this code for any purpose. Attribution is appreciated but not required.

May God's peace and blessings be upon the Prophet Muhammad ﷺ, his family, and his companions.
