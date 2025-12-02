import { createProductModule } from "./createProductModule.js";
import { createWarehouseModule } from "./createWarehouseModule.js";
import { createProductTransferModule } from "./moveProductToWarehouseModule.js";
import { createLowQuantityListModule } from "./lowProductAlertModule.js";
import { createLandingPage } from "./landingPageModule.js";
import { createLoginModule } from "./loginModule.js";
import {showOverlay} from "./ReusableFunctions.js";

const app = document.getElementById("app");

// ---------- render dashboard ----------
export function renderDashboard() {


    const wrapper = document.createElement("div");
    wrapper.id = "dashboard-wrapper";

    const grid = document.createElement("div");
    grid.id = "dashboard-grid";

    grid.appendChild(createDashboardCard("Opret produkt", function(){
       return createProductModule()
    }));
    grid.appendChild(createDashboardCard("Opret lager", function(){
        return createWarehouseModule()
    }));
    grid.appendChild(createDashboardCard("Flyt produkt til lager", function (){
        return createProductTransferModule()
    }));
    grid.appendChild(createDashboardCard("Lav beholdningsstatus", function (){
       return  createLowQuantityListModule()
    }));
    grid.appendChild(createDashboardCard("Landing page", function (){
        return createLandingPage()
    }));

    grid.appendChild(createDashboardCard("Log ind", function(){
        return createLoginModule()
    }));

    wrapper.appendChild(grid);
   return wrapper;
}

// ---------- Lav dashboard card ----------
function createDashboardCard(title, handler) {
    const card = document.createElement("div");
    card.className = "dashboard-card";

    const text = document.createElement("h3");
    text.textContent = title;

    card.appendChild(text);

    if (typeof handler === "function") {
        card.addEventListener("click", () => {
            console.log(`Kører: ${title}`);
            app.appendChild(showOverlay(handler()));
        });
    }

    return card;
}



