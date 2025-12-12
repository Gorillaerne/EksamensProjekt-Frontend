import {authorizedFetch, showNotification} from "./ReusableFunctions.js";

export async function createProductPageModule(productId) {


    const response = await authorizedFetch("/api/products/" + productId);

    if (!response.ok) {
        console.error("Kunne ikke hente produkt:", response.status);
        return showNotification(await response.text(),"error",5000);
    }

    const product = await response.json();
    console.log("Product fra backend:", product);

    const wrapper = document.createElement("div");
    wrapper.classList.add("pm-form");

    const title = document.createElement("h2");
    title.textContent = "Produktside";
    title.classList.add("pm-title");
    wrapper.appendChild(title);
    
    const imageField = document.createElement("div");
    imageField.classList.add("pm-field", "pm-image-field");

    const imageWrapper = document.createElement("div");
    imageWrapper.classList.add("pm-image-wrapper");

    const img = document.createElement("img");
    img.classList.add("pm-image");
    img.alt = product.name ?? "Produktbillede";

    if (product.picture) {
        img.src = product.picture;
    } else {
        img.src = "";
        img.classList.add("pm-image-placeholder");
    }

    imageWrapper.appendChild(img);
    imageField.appendChild(imageWrapper);

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";
    imageField.appendChild(fileInput);

    img.addEventListener("click", () => {
        fileInput.click();
    });

    fileInput.addEventListener("change", async () => {
        const file = fileInput.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = async (e) => {
            const dataUrl = e.target.result;

            img.src = dataUrl;
            img.classList.remove("pm-image-placeholder");

            const objectToSend = {
                picture: dataUrl
            };

            const response = await authorizedFetch("/api/products/" + productId, {
                method: "PATCH",
                body: JSON.stringify(objectToSend),
            });

            if (!response.ok) {
                return showNotification(await response.text(),"error",5000);
            } else {
                console.log("Billede opdateret");
            }
        };

        reader.readAsDataURL(file);
    });

    wrapper.appendChild(imageField);
    wrapper.appendChild(createLabeledInput("Navn", product.name, "name", "pm-name", productId));
    wrapper.appendChild(createLabeledInput("SKU-Nummer", product.SKU ?? product.sku ?? "", "SKU", "pm-sku", productId));
    wrapper.appendChild(createLabeledInput("Pris", product.price, "price", "pm-price", productId, "number"));
    wrapper.appendChild(createLabeledInput("Beskrivelse", product.description ?? "", "description", "pm-description", productId));

    const warehouseLabel = document.createElement("label");
    warehouseLabel.textContent = "Lagerbeholdning";
    warehouseLabel.classList.add("pm-warehouse-label");
    wrapper.appendChild(warehouseLabel);

    const warehouseQuantityWrapper = document.createElement("div");
    warehouseQuantityWrapper.classList.add("pm-warehouse-wrapper");

    product.warehouseList.forEach(wh => {
        const warehouseItem = document.createElement("div");
        warehouseItem.classList.add("pm-warehouse-item");

        const warehouseitemName = document.createElement("div");
        warehouseitemName.classList.add("pm-warehouse-item-name");
        warehouseitemName.textContent = wh.name;
        warehouseItem.appendChild(warehouseitemName);

        const warehouseitemQuantity = document.createElement("input");
        warehouseitemQuantity.classList.add("pm-warehouse-item-quantity");
        warehouseitemQuantity.type = "number";
        warehouseitemQuantity.step = "1";
        warehouseitemQuantity.min = "0";
        warehouseitemQuantity.value = wh.quantity;

        warehouseitemQuantity.addEventListener("blur", async function () {
            const patchWarehouseProduct = {
                id: wh.id,
                quantity: Number(warehouseitemQuantity.value)
            };

            try {
                const warehouseProductResponse = await authorizedFetch(
                    "/api/warehouseproducts",
                    {
                        method: "PATCH",
                        body: JSON.stringify(patchWarehouseProduct)
                    }
                );

                if (!warehouseProductResponse.ok) {
                    return showNotification(await warehouseProductResponse.text(),"error",5000);
                }
            } catch (e) {
                return showNotification("Netværksfejl - kunne ikke oprette forbindelse til backend","error",5000);
            }
        });

        warehouseItem.appendChild(warehouseitemQuantity);
        warehouseQuantityWrapper.appendChild(warehouseItem);
    });

    wrapper.appendChild(warehouseQuantityWrapper);

    return wrapper;
}

function createLabeledInput(labelText, value, variableName, className, productId, type = "text") {
    const container = document.createElement("div");
    container.classList.add("pm-field");

    const label = document.createElement("label");
    label.textContent = labelText;
    label.classList.add("pm-label");

    const input = document.createElement("input");
    input.type = type;
    input.value = value;
    input.dataset.variableName = variableName;
    input.classList.add(className);

    createBlurlistenerForInput(input, productId);

    container.appendChild(label);
    container.appendChild(input);

    return container;
}

function createBlurlistenerForInput(input, productId) {
    input.addEventListener("blur", async function () {
        const objectToSend = {
            [input.dataset.variableName]: input.value
        };

        try {
            const response = await authorizedFetch("/api/products/" + productId, {
                method: "PATCH",
                body: JSON.stringify(objectToSend),
            });

            if (!response.ok) {
                return showNotification(await response.text(),"error",5000);
            }
        }catch (e){
            return showNotification("Netværksfejl - kunne ikke oprette forbindelse til backend","error",5000);
        }
    });
}
