import {createSearchBar} from "./searchBar.js";
import {showOverlay} from "./ReusableFunctions.js";
import {createShowLogModule} from "./createShowLogsModule.js";

export async function createHeader(){

    const wrapper = document.createElement("div");
    wrapper.classList.add("db-wrapper");

    /* ---------------------- HEADER ---------------------- */
    const header = document.createElement("header");
    header.classList.add("db-header");

    const logo = document.createElement("img");
    logo.src = "pictures/elvangLogo.png"
    logo.classList.add("lp-logo");


    header.appendChild(logo);
    header.appendChild(await createSearchBar())

    const changesLogButton = document.createElement("button")
    changesLogButton.textContent = "Ændrings Historik"
    changesLogButton.classList.add("logout-btn")
    changesLogButton.addEventListener("click", () => {
        const component = createShowLogModule();
        showOverlay(component);
    })

    header.appendChild(changesLogButton)


    const logoutButton = document.createElement("button")
    logoutButton.textContent = "Log ud"
    logoutButton.classList.add("logout-btn")
    logoutButton.addEventListener("click", function (){
        localStorage.removeItem("token")
        location.reload();
    })
    header.appendChild(logoutButton)


    wrapper.appendChild(header);

    return wrapper
}