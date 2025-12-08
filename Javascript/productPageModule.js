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

    const warehouseQuantityWrapper = document.createElement("div");
    product.warehouseList.forEach(wh => {
        const warehouseItem = document.createElement("div");

        const warehouseitemName = document.createElement("div");
        warehouseitemName.textContent = wh.name;
        warehouseItem.appendChild(warehouseitemName);



        const warehouseitemQuantity = document.createElement("input");
        warehouseitemQuantity.type = "number";
        warehouseitemQuantity.step = "1";
        warehouseitemQuantity.min = "0";
        warehouseitemQuantity.value = wh.quantity;

        warehouseitemQuantity.addEventListener("blur", async function () {
            const patchWarehouseProduct = {
                id:wh.id,
                quantity: warehouseitemQuantity.value
            }

            try{
            const warehouseProductResponse = await authorizedFetch("http://localhost:8080/api/warehouseproducts", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(patchWarehouseProduct)
            });

            if(!warehouseProductResponse.ok){
                throw new Error(await warehouseProductResponse.text());
            }

            } catch (e){
                console.log(e);
            }

            }

        )
        warehouseItem.appendChild(warehouseitemQuantity);



        warehouseQuantityWrapper.appendChild(warehouseItem);
        }
    )
    wrapper.appendChild(warehouseQuantityWrapper);



    return wrapper;
}

