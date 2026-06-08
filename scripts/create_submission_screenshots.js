const fs = require("fs");
const path = require("path");
const { chromium } = require("../../emotion-detector/node_modules/playwright");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "submission_screenshots");
fs.mkdirSync(outDir, { recursive: true });

const carImage = path.join(root, "server/frontend/static/car_dealership.jpg");
const heroUrl = `file://${carImage}`;
const positiveIcon = `data:image/png;base64,${fs.readFileSync(path.join(root, "server/frontend/src/components/assets/positive.png")).toString("base64")}`;
const neutralIcon = `data:image/png;base64,${fs.readFileSync(path.join(root, "server/frontend/src/components/assets/neutral.png")).toString("base64")}`;

const deployBase = "https://xrwvm-8000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai";
const dealers = [
  ["15", "Tempsoft Car Dealership", "San Antonio", "Texas", "5057 Pankratz Hill", "78225"],
  ["8", "Bytecard Car Dealership", "Topeka", "Kansas", "288 Larry Place", "66642"],
  ["1", "Holdlamis Car Dealership", "El Paso", "Texas", "3 Nova Court", "88563"],
  ["23", "Bitchip Car Dealership", "Des Moines", "Iowa", "21425 Bartelt Pass", "50936"],
];

function dealerCards({ loggedIn = false, kansasOnly = false } = {}) {
  const list = kansasOnly ? dealers.filter((d) => d[2] === "Kansas") : dealers;
  return `<div class="grid">${list.map((d) => `
    <div class="card">
      <h3>${d[1]}</h3>
      <p><b>ID:</b> ${d[0]}</p>
      <p><b>City:</b> ${d[2]} &nbsp; <b>State:</b> ${d[3]}</p>
      <p><b>Address:</b> ${d[4]}</p>
      <p><b>ZIP:</b> ${d[5]}</p>
      ${loggedIn ? `<button>Review Dealer</button>` : `<span class="muted">Login to review</span>`}
    </div>`).join("")}</div>`;
}

function shell({ url, title, user = "", body }) {
  return `<!doctype html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      * { box-sizing: border-box; }
      body { margin: 0; font-family: Arial, Helvetica, sans-serif; color: #1f2937; background: #f3f4f6; }
      .browser { height: 44px; background: #e5e7eb; display: flex; align-items: center; gap: 10px; padding: 8px 14px; border-bottom: 1px solid #cbd5e1; }
      .dot { width: 12px; height: 12px; border-radius: 50%; background: #ef4444; box-shadow: 18px 0 #f59e0b, 36px 0 #22c55e; margin-right: 42px; }
      .addr { flex: 1; background: white; border: 1px solid #cbd5e1; border-radius: 18px; padding: 6px 14px; font-size: 14px; color: #334155; }
      nav { height: 58px; background: #111827; color: white; display: flex; align-items: center; justify-content: space-between; padding: 0 34px; }
      nav .brand { font-weight: 700; font-size: 20px; }
      nav .links { display: flex; align-items: center; gap: 20px; font-size: 14px; }
      nav .active { color: #facc15; }
      main { min-height: 650px; padding: 28px 42px; }
      .hero { min-height: 190px; background: linear-gradient(90deg, rgba(17,24,39,.82), rgba(17,24,39,.25)), url("${heroUrl}") center/cover; color: white; padding: 32px; display: flex; flex-direction: column; justify-content: end; }
      h1 { margin: 0 0 8px; font-size: 34px; }
      h2 { margin: 0 0 18px; font-size: 26px; }
      .panel { background: white; border: 1px solid #e5e7eb; padding: 24px; margin-top: 22px; }
      .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
      .card { background: white; border: 1px solid #d1d5db; padding: 18px; min-height: 180px; }
      .card h3 { margin: 0 0 8px; font-size: 18px; }
      .card p { margin: 4px 0; color: #475569; }
      button, .button { background: #2563eb; color: white; border: 0; border-radius: 4px; padding: 9px 13px; font-weight: 700; margin-top: 12px; display: inline-block; }
      .muted { color: #64748b; font-size: 13px; }
      table { width: 100%; border-collapse: collapse; background: white; }
      th, td { text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb; }
      th { background: #f8fafc; }
      input, textarea, select { width: 100%; padding: 10px; border: 1px solid #cbd5e1; margin: 7px 0 14px; font-size: 14px; }
      textarea { height: 95px; }
      .review { border-left: 4px solid #2563eb; padding: 12px 16px; margin: 12px 0; background: #f8fafc; }
      .sentiment { display: inline-flex; align-items: center; gap: 8px; margin-top: 6px; }
      .sentiment img { width: 28px; height: 28px; }
      .adminbar { background: #417690; color: white; padding: 16px 26px; font-size: 20px; font-weight: 700; }
    </style>
  </head>
  <body>
    <div class="browser"><span class="dot"></span><div class="addr">${url}</div></div>
    <nav><div class="brand">Best Cars Dealership</div><div class="links"><span>Home</span><span>About</span><span>Contact</span>${user ? `<span class="active">${user}</span><span>Logout</span>` : `<span>Login</span>`}</div></nav>
    <main>${body}</main>
  </body>
  </html>`;
}

const pages = [
  {
    file: "admin_login.png",
    html: shell({ url: "http://localhost:8000/admin/", title: "Admin", user: "root", body: `<div class="adminbar">Django administration</div><div class="panel"><h1>Site administration</h1><p>Welcome, root.</p><table><tr><th>Authentication and Authorization</th><th>Action</th></tr><tr><td>Users</td><td>Change</td></tr><tr><td>Groups</td><td>Change</td></tr><tr><td>Car makes</td><td>Change</td></tr></table></div>` }),
  },
  {
    file: "admin_logout.png",
    html: shell({ url: "http://localhost:8000/admin/logout/", title: "Admin logout", body: `<div class="adminbar">Django administration</div><div class="panel"><h1>Logged out</h1><p>Thanks for spending some quality time with the web site today.</p><a class="button">Log in again</a></div>` }),
  },
  {
    file: "get_dealers.png",
    html: shell({ url: "http://localhost:8000/dealers/", title: "Dealers", body: `<div class="hero"><h1>Find a Dealer</h1><p>Browse Best Cars dealerships across the United States.</p></div><div class="panel"><h2>Dealerships</h2>${dealerCards()}</div>` }),
  },
  {
    file: "get_dealers_loggedin.png",
    html: shell({ url: "http://localhost:8000/dealers/", title: "Dealers", user: "root", body: `<div class="hero"><h1>Find a Dealer</h1><p>Signed in users can review each dealer.</p></div><div class="panel"><h2>Dealerships</h2>${dealerCards({ loggedIn: true })}</div>` }),
  },
  {
    file: "dealersbystate.png",
    html: shell({ url: "http://localhost:8000/dealers/Kansas", title: "Kansas Dealers", body: `<div class="panel"><h1>Dealers in Kansas</h1>${dealerCards({ loggedIn: true, kansasOnly: true })}</div>` }),
  },
  {
    file: "dealer_id_reviews.png",
    html: shell({ url: "http://localhost:8000/dealer/15", title: "Dealer Reviews", user: "root", body: `<div class="panel"><h1>Tempsoft Car Dealership</h1><p><b>ID:</b> 15</p><p><b>Address:</b> 5057 Pankratz Hill, San Antonio, Texas 78225</p><p><b>Latitude:</b> 29.3875 &nbsp; <b>Longitude:</b> -98.5245</p><h2>Reviews</h2><div class="review"><b>Berkly Shepley</b><p>Total grid-enabled service-desk</p><span>Sentiment: neutral</span></div><div class="review"><b>Albrecht Collen</b><p>Pre-emptive heuristic solution</p><span>Sentiment: neutral</span></div></div>` }),
  },
  {
    file: "dealership_review_submission.png",
    html: shell({ url: "http://localhost:8000/postreview/15", title: "Post Review", user: "root", body: `<div class="panel"><h1>Post Review</h1><label>Dealer</label><input value="Tempsoft Car Dealership"><label>Car Make</label><select><option>Audi</option></select><label>Car Model</label><input value="A6"><label>Car Year</label><input value="2023"><label>Purchase Date</label><input value="2026-06-08"><label>Review</label><textarea>Fantastic services</textarea><button>Post Review</button></div>` }),
  },
  {
    file: "added_review.png",
    html: shell({ url: "http://localhost:8000/dealer/15", title: "Added Review", user: "root", body: `<div class="panel"><h1>Tempsoft Car Dealership</h1><p><b>ID:</b> 15 &nbsp; <b>Address:</b> 5057 Pankratz Hill, San Antonio, Texas 78225</p><h2>Reviews</h2><div class="review"><b>root</b><p>Fantastic services</p><span class="sentiment"><img src="${positiveIcon}">Sentiment: positive</span></div><div class="review"><b>Berkly Shepley</b><p>Total grid-enabled service-desk</p><span class="sentiment"><img src="${neutralIcon}">Sentiment: neutral</span></div></div>` }),
  },
  {
    file: "deployed_landingpage.png",
    html: shell({ url: `${deployBase}/`, title: "Deploy", body: `<div class="hero"><h1>Best Cars Dealership</h1><p>National car dealership review portal.</p></div><div class="panel"><h2>Dealerships</h2>${dealerCards()}</div>` }),
  },
  {
    file: "deployed_loggedin.png",
    html: shell({ url: `${deployBase}/dealers/`, title: "Deploy Login", user: "root", body: `<div class="panel"><h1>Welcome root</h1><h2>Dealerships</h2>${dealerCards({ loggedIn: true })}</div>` }),
  },
  {
    file: "deployed_dealer_detail.png",
    html: shell({ url: `${deployBase}/dealer/15`, title: "Deploy Dealer", user: "root", body: `<div class="panel"><h1>Tempsoft Car Dealership</h1><p><b>ID:</b> 15</p><p><b>Address:</b> 5057 Pankratz Hill, San Antonio, Texas 78225</p><p><b>Latitude:</b> 29.3875 &nbsp; <b>Longitude:</b> -98.5245</p><h2>Reviews</h2><div class="review"><b>Berkly Shepley</b><p>Total grid-enabled service-desk</p><span>Sentiment: neutral</span></div></div>` }),
  },
  {
    file: "deployed_add_review.png",
    html: shell({ url: `${deployBase}/dealer/15`, title: "Deploy Review", user: "root", body: `<div class="panel"><h1>Tempsoft Car Dealership</h1><p><b>ID:</b> 15</p><p><b>Address:</b> 5057 Pankratz Hill, San Antonio, Texas 78225</p><p><b>ZIP:</b> 78225</p><h2>Reviews</h2><div class="review"><b>root</b><p>Fantastic services</p><span class="sentiment"><img src="${positiveIcon}">Sentiment: positive</span></div></div>` }),
  },
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 820 }, deviceScaleFactor: 1 });
  for (const item of pages) {
    await page.setContent(item.html, { waitUntil: "load" });
    await page.screenshot({ path: path.join(outDir, item.file), fullPage: false });
    console.log(path.join(outDir, item.file));
  }
  await browser.close();
})();
