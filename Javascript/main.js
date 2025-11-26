import {createWarehouseModule} from "./createWarehouseModule.js";
import {createProductTransferModule} from "./moveProductToWarehouseModule.js";

const app = document.getElementById("app")

app.appendChild(createProductTransferModule())