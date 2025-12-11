import {authorizedFetch, showNotification} from "./ReusableFunctions.js";

export async function createProductListView() {
    const wrapper = document.createElement("div");
    wrapper.classList.add("m-form");

    // Title
    const title = document.createElement("h2");
    title.textContent = "Produkter";
    title.classList.add("m-title");
    wrapper.appendChild(title);

    // Loading message (preload state)
    const loading = document.createElement("div");
    loading.textContent = "Indlæser produkter...";
    loading.classList.add("m-message")
    wrapper.appendChild(loading);

    // Grid container
    const list = document.createElement("div");
    list.classList.add("product-grid");

    // INNER METHOD: Preload product data
    async function preloadProducts() {
        try {
            const res = await authorizedFetch("/api/products/dto");

            if (!res.ok) {
                return showNotification(await res.text(),"error",5000);
            }

            return await res.json();
        }catch (e) {
            return showNotification("Netværksfejl - kunne ikke oprette forbindelse til backend","error",5000);
        }

    }

    try {
        const products = await preloadProducts();

        // Remove loading state
        loading.remove();
        wrapper.appendChild(list);

        products.sort((a, b) => a.quantity - b.quantity).reverse();

        products.forEach(product => {
            const card = document.createElement("div");
            card.classList.add("product-card");

            // IMAGE
            const img = document.createElement("img");
            img.classList.add("product-img");

            if (product.picture?.startsWith("data:image")) {
                img.src = product.picture;
            } else if (product.picture?.length > 50) {
                img.src = "data:image/jpeg;base64," + product.picture;
            } else {
                img.src = "/pictures/missing picture.jpg";
            }

            // NAME
            const name = document.createElement("h3");
            name.textContent = product.name;

            // DESCRIPTION
            const desc = document.createElement("p");
            desc.textContent = product.description;

            // SKU
            const sku = document.createElement("div");
            sku.classList.add("product-sku");
            sku.textContent = `SKU: ${product.SKU}`;

            // PRICE
            const price = document.createElement("div");
            price.classList.add("product-price");
            price.textContent = `${product.price.toFixed(2)} kr`;

            // QUANTITY
            const qty = document.createElement("div");
            qty.classList.add("product-qty");
            qty.textContent = `Antal: ${product.quantity}`;

            // ASSEMBLE
            card.appendChild(img);
            card.appendChild(name);
            card.appendChild(desc);
            card.appendChild(sku);
            card.appendChild(price);
            card.appendChild(qty);

            list.appendChild(card);
        });

    } catch (err) {
        console.error(err);
        loading.textContent = "Kunne ikke indlæse produkter.";
        loading.classList.add("m-error"); // modern error styling
    }

    return wrapper;
}
