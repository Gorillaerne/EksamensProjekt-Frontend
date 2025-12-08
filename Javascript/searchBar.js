import {authorizedFetch, showOverlay} from "./ReusableFunctions.js";
import {createProductPageModule} from "./productPageModule.js";

export async function createSearchBar() {

    const response = await authorizedFetch("http://localhost:8080/api/products/searchBar");

    if (!response.ok) {
        console.error("Failed to fetch search products");
        return;
    }

    const productList = await response.json();

    // --------------------------
    // Create search bar elements
    // --------------------------
    const wrapper = document.createElement("div");
    wrapper.classList.add("search-wrapper");

    const searchBar = document.createElement("input");
    searchBar.type = "search";
    searchBar.placeholder = "Søg efter produkter";
    searchBar.classList.add("search-bar");

    const resultBox = document.createElement("div");
    resultBox.classList.add("search-results");

    wrapper.appendChild(searchBar);
    wrapper.appendChild(resultBox);

    // --------------------------------
    // Search filter function (top 5)
    // --------------------------------
    function updateResults(query) {
        resultBox.innerHTML = "";

        if (!query.trim()) {
            return;
        }

        const results = productList
            .filter(product => {
                const q = query.toLowerCase();

                return (
                    product.id.toString().includes(q) ||
                    product.name.toLowerCase().includes(q) ||
                    product.description.toLowerCase().includes(q) ||
                    product.SKU.toLowerCase().includes(q) ||
                    product.price.toString().includes(q)
                );
            });

        results.slice(0, 5).forEach(product => {

            const item = document.createElement("div");
            item.classList.add("search-result-item");

            // --- IMAGE ---
            const img = document.createElement("img");
            img.classList.add("result-image");
            img.src = product.picture;
            img.alt = product.name;

            // --- INFO WRAPPER ---
            const info = document.createElement("div");
            info.classList.add("result-info");

            // name
            const name = document.createElement("span");
            name.classList.add("result-name");
            name.textContent = product.name;

            // price
            const price = document.createElement("span");
            price.classList.add("result-price");
            price.textContent = product.price + " kr";

            // SKU
            const sku = document.createElement("span");
            sku.classList.add("result-sku");
            sku.textContent = product.SKU;

            // assemble info box
            info.appendChild(name);
            info.appendChild(price);
            info.appendChild(sku);

            // assemble full item
            item.appendChild(img);
            item.appendChild(info);

            // click → fill input & close dropdown
            item.addEventListener("click", async () => {
                searchBar.value = product.name;
                resultBox.innerHTML = "";
                resultBox.style.display = "none";
                showOverlay(await createProductPageModule(product.id))
            });

            resultBox.appendChild(item);
            resultBox.style.display = "block";
        });
    }

    // -----------------------
    // Event listener (typing)
    // -----------------------
    searchBar.addEventListener("input", () => {
        updateResults(searchBar.value);
    });

    return wrapper;
}