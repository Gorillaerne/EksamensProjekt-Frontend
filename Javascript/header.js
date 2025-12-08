import {createSearchBar} from "./searchBar.js";

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