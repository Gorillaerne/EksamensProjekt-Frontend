import { authorizedFetch } from "./ReusableFunctions.js";



export async function createProductPageModule(productId){

    const response = await authorizedFetch("http://localhost:8080/api/products/" + productId)

    if(!response.ok){
        return;
    }

    const product = await response.json();



    const wrapper = document.createElement("div");
    wrapper.classList.add("dm-form");

    const title = document.createElement("h2");
    title.textContent = product.name;
    title.classList.add("dm-title");
    wrapper.appendChild(title);

    return wrapper;
}

