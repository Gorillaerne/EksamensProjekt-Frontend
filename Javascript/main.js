import {createWarehouseModule} from "./createWarehouseModule.js";
import {createProductTransferModule} from "./moveProductToWarehouseModule.js";
import {createLandingPage} from "./landingPageModule.js";
import {createLowQuantityListModule} from "./lowProductAlertModule.js";

const app = document.getElementById("app")

app.appendChild(createLowQuantityListModule())