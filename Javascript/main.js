import {createWarehouseModule} from "./createWarehouseModule.js";
import {createLoginModule} from "./loginModule.js";
import {createLandingPage} from "./landingPageModule.js";

const app = document.getElementById("app")

app.appendChild(createLandingPage())