import { authorizedFetch } from "./ReusableFunctions.js";



export async function createProductPageModule(productId){

    const response = await authorizedFetch("http://localhost:8080/api/products/" + productId)

    if(!response.ok){
        return;
    }

    const product = await response.json();

    const wrapper = document.createElement("div");
    wrapper.classList.add("m-form");

    const title = document.createElement("h2");
    title.textContent = "Produktside"
    title.classList.add("m-title");
    wrapper.appendChild(title);


    const name = document.createElement("input");
    name.value = product.name;
    name.classList.add("pm-name");
    wrapper.appendChild(name);

    const sku = document.createElement("input");
    sku.value = product.SKU;
    sku.classList.add("pm-sku");
    wrapper.appendChild(sku);

    const price = document.createElement("input");
    price.value = product.price;
    price.classList.add("pm-price");
    wrapper.appendChild(price);

    const description = document.createElement("input");
    description.value = product.description;
    description.classList.add("pm-description");
    wrapper.appendChild(description);






    return wrapper;
}

