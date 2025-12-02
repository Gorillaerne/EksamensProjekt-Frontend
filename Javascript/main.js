
import {createHeader} from "./header.js";
import {createLoginModule} from "./loginModule.js";
import {renderDashboard} from "./dashboard.js";

const app = document.getElementById("app")


app.appendChild(await createHeader())
app.appendChild(renderDashboard())
