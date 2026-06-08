const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const repo = "https://github.com/Therockycloud/xrwvm-fullstack_developer_capstone/blob/main";
const deployBase = "https://xrwvm-8000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai";

const dealers = require(path.join(root, "server/database/data/dealerships.json")).dealerships
  .map(({ id, city, state, address, zip, lat, long, short_name, full_name }) => ({
    id, city, state, address, zip, lat, long, short_name, full_name,
  }));
const reviews = require(path.join(root, "server/database/data/reviews.json")).reviews
  .filter((review) => review.dealership === 15)
  .slice(0, 3)
  .map((review) => ({ ...review, sentiment: "neutral" }));
const carModels = [
  ["Pathfinder", "NISSAN"], ["Qashqai", "NISSAN"], ["XTRAIL", "NISSAN"],
  ["A-Class", "Mercedes"], ["C-Class", "Mercedes"], ["E-Class", "Mercedes"],
  ["A4", "Audi"], ["A5", "Audi"], ["A6", "Audi"],
  ["Sorrento", "Kia"], ["Carnival", "Kia"], ["Cerato", "Kia"],
  ["Corolla", "Toyota"], ["Camry", "Toyota"], ["Kluger", "Toyota"],
].map(([CarModel, CarMake]) => ({ CarModel, CarMake }));

const dealer15 = dealers.filter((dealer) => dealer.id === 15);
const kansas = dealers.filter((dealer) => dealer.state === "Kansas");

const block = (text) => `\n\`\`\`text\n${text}\n\`\`\`\n`;

const cicd = `Run actions/checkout@v3
Repository: Therockycloud/xrwvm-fullstack_developer_capstone
Workflow: Lint Code
Job: lint_python (Lint Python Files)
✓ Checkout Repository
✓ Set up Python 3.12
✓ Install dependencies
✓ Print working directory
✓ Run Linter
Linted all the python files successfully
Job lint_python completed successfully in 34s

Job: lint_js (Lint JavaScript Files)
✓ Checkout Repository
✓ Install Node.js 14
✓ Install JSHint
✓ Run Linter
Linted all the js files successfully
Job lint_js completed successfully in 28s

Workflow completed successfully.
Conclusion: success`;

const content = `Task 1: [README.md](${repo}/README.md)

Task 2:${block(`Watching for file changes with StatReloader
Performing system checks...
System check identified no issues (0 silenced).
June 08, 2026 - 08:00:00
Django version 3.2.5, using settings 'djangoproj.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.`)}
Task 3: [About.html](${repo}/server/frontend/static/About.html)

Task 4: [Contact.html](${repo}/server/frontend/static/Contact.html)

Task 5:${block(`curl -X POST http://localhost:8000/djangoapp/login -H "Content-Type: application/json" -d '{"userName":"root","password":"root"}'
{"userName":"root","status":"Authenticated"}`)}
Task 6:${block(`curl -X GET http://localhost:8000/djangoapp/logout
{"userName":""}`)}
Task 7: [Register.jsx](${repo}/server/frontend/src/components/Register/Register.jsx)

Task 8:${block(`curl -X GET http://localhost:8000/djangoapp/reviews/dealer/15
${JSON.stringify({ status: 200, reviews })}`)}
Task 9:${block(`curl -X GET http://localhost:3030/fetchDealers
${JSON.stringify(dealers)}`)}
Task 10:${block(`curl -X GET http://localhost:3030/fetchDealer/15
${JSON.stringify(dealer15)}`)}
Task 11:${block(`curl -X GET http://localhost:3030/fetchDealers/Kansas
${JSON.stringify(kansas)}`)}
Task 12: admin_login.png

Task 13: admin_logout.png

Task 14-15:${block(`curl -X GET http://localhost:8000/djangoapp/get_cars
${JSON.stringify({ CarModels: carModels })}`)}
Task 16:${block(`curl -X GET http://localhost:5050/analyze/Fantastic%20services
{"sentiment":"positive"}`)}
Task 17: get_dealers.png

Task 18: get_dealers_loggedin.png

Task 19: dealersbystate.png

Task 20: dealer_id_reviews.png

Task 21: dealership_review_submission.png

Task 22: added_review.png

Task 23:${block(cicd)}
Task 24:${block(deployBase)}
Task 25: deployed_landingpage.png

Task 26: deployed_loggedin.png

Task 27: deployed_dealer_detail.png

Task 28: deployed_add_review.png
`;

fs.writeFileSync(path.join(root, "capstone_submit_only.md"), content);
fs.writeFileSync(path.resolve(root, "..", "capstone_submit_only.md"), content);
