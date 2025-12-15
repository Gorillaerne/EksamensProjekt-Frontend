import { createProductModule } from "./createProductModule.js";
import { createWarehouseModule } from "./createWarehouseModule.js";
import { createProductTransferModule } from "./moveProductToWarehouseModule.js";
import { createLowQuantityListModule } from "./lowProductAlertModule.js";
import { createLandingPage } from "./landingPageModule.js";
import {authorizedFetch, isTokenExpired, showNotification, showOverlay} from "./ReusableFunctions.js";
import {createNewDeliveryModule} from "./createNewDeliveryModule.js";
import {createProductListView} from "./createShowAllProductsModule.js";
import {createUserModule} from "./createNewUserModule.js";

const app = document.getElementById("app");

// ---------- render dashboard ----------
export async function renderDashboard() {
    let role = "";


    if (isTokenExpired()){
        app.innerHTML="";
        app.appendChild(createLandingPage())
        return
    }else {
        const user = await getUserRoll(); // wait for the promise
        role = user.role;
    }



    const wrapper = document.createElement("div");
    wrapper.id = "dashboard-wrapper";

    const grid = document.createElement("div");
    grid.id = "dashboard-grid";



    grid.appendChild(createDashboardCard("Opret produkt", function(){
       return createProductModule()
    }));

    grid.appendChild(createDashboardCard("Flyt produkt til lager", function (){
        return createProductTransferModule()
    }));
    grid.appendChild(createDashboardCard("Lav beholdningsstatus", async function (){
       return await createLowQuantityListModule()
    }));

    grid.appendChild(createDashboardCard("Registrer ny leverance", function(){
        return createNewDeliveryModule()
    }));

    grid.appendChild(createDashboardCard("Se alle produkter", async function(){
        return await createProductListView()
    }));

    if (role === "ROLE_ADMIN"){
        grid.appendChild(createDashboardCard("Opret lager", function(){
            return createWarehouseModule()
        }));

        grid.appendChild(createDashboardCard("Adminstrer brugere", function(){
            return createUserModule()
        }));

    }




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
        card.addEventListener("click", async() => {
            console.log(`Kører: ${title}`);
            app.appendChild(showOverlay(await handler()));
        });
    }

    return card;
}


async function getUserRoll(){
    try {
        const response = await authorizedFetch("/api/users/me")

        if (!response.ok) {
            // Get the response text first
            const errorMessage = await response.text();
            return showNotification(errorMessage,"error",5000);
            // Throw a custom error
        }

        return await response.json();

    }catch (e){

        return showNotification("Netværksfejl - kunne ikke oprette forbindelse til backend","error",5000);
    }





}

