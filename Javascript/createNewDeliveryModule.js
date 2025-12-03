
import { authorizedFetch } from "./ReusableFunctions.js";

export function createNewDeliveryModule() {
    // MAIN WRAPPER
    const wrapper = document.createElement("div");
    wrapper.classList.add("m-form"); // Reuse product module style

    // TITLE
    const title = document.createElement("h2");
    title.textContent = "Opret Levering";
    title.classList.add("m-title"); // Reuse title style
    wrapper.appendChild(title);

    // FLEX ROW
    const contentRow = document.createElement("div");
    contentRow.classList.add("m-content-row"); // Reuse flex layout
    wrapper.appendChild(contentRow);

    // LEFT SIDE (fields)
    const fieldsContainer = document.createElement("div");
    fieldsContainer.classList.add("dm-fields-container"); // Reuse container style
    contentRow.appendChild(fieldsContainer);

    // Helper function for adding fields
    function addField(labelText, el, container = fieldsContainer) {
        const field = document.createElement("div");
        field.classList.add("m-field"); // Reuse field style

        const label = document.createElement("label");
        label.textContent = labelText;
        label.classList.add("m-label"); // Reuse label style

        el.classList.add("m-input"); // Reuse input style

        field.appendChild(label);
        field.appendChild(el);
        container.appendChild(field);
    }

    // PRODUCT LIST CONTAINER
    const productListContainer = document.createElement("div");
    productListContainer.classList.add("dm-product-list"); // New class for grouping rows
    fieldsContainer.appendChild(productListContainer);

    // Preload products and warehouses
    let allProducts = [];
    let allWarehouses = [];

    async function preloadData() {
        try {
            const productRes = await authorizedFetch("http://localhost:8080/api/products/searchBar");
            if (productRes.ok) {
                allProducts = await productRes.json();
            }

            const warehouseRes = await authorizedFetch("http://localhost:8080/api/warehouses/dto");
            if (warehouseRes.ok) {
                allWarehouses = await warehouseRes.json();
            }
        } catch (err) {
            console.error("Fejl ved preload:", err);
        }
    }

    // Function to create a product row

    function createProductRow() {
        const row = document.createElement("div");
        row.classList.add("dm-product-row");

        // Create wrapper for input + suggestions
        const inputWrapper = document.createElement("div");
        inputWrapper.style.position = "relative"; // Important!
        row.appendChild(inputWrapper);

        // Product search input
        const productInput = document.createElement("input");
        productInput.type = "text";
        productInput.placeholder = "Søg produkt...";
        productInput.required = true;
        addField("Produkt", productInput, inputWrapper);

        // Autocomplete dropdown
        const suggestionBox = document.createElement("div");
        suggestionBox.classList.add("dm-suggestions");
        inputWrapper.appendChild(suggestionBox);

        // Filter products
        productInput.addEventListener("input", () => {
            const query = productInput.value.trim().toLowerCase();
            suggestionBox.innerHTML = "";

            if (query.length < 1) {
                suggestionBox.style.display = "none";
                return;
            }

            const matches = allProducts.filter(p => p.name.toLowerCase().includes(query));
            suggestionBox.style.display = matches.length ? "block" : "none";

            matches.forEach(prod => {
                const item = document.createElement("div");
                item.classList.add("dm-suggestion-item");
                item.textContent = prod.name;
                item.addEventListener("click", () => {
                    productInput.value = prod.name;
                    productInput.dataset.productId = prod.id;
                    suggestionBox.innerHTML = "";
                    suggestionBox.style.display = "none";
                });
                suggestionBox.appendChild(item);
            });
        });

        // Quantity input
        const qtyInput = document.createElement("input");
        qtyInput.type = "number";
        qtyInput.min = "1";
        qtyInput.required = true;
        addField("Antal", qtyInput, row);

        // Warehouse select
        const warehouseSelect = document.createElement("select");
        warehouseSelect.required = true;
        allWarehouses.forEach(w => {
            const option = document.createElement("option");
            option.value = w.id;
            option.textContent = w.name;
            warehouseSelect.appendChild(option);
        });
        addField("Lager", warehouseSelect, row);

        productListContainer.appendChild(row);
    }


    // Add first product row
    preloadData().then(() => {
        createProductRow();
    });

    // Add more products button
    const addProductBtn = document.createElement("button");
    addProductBtn.textContent = "+ Tilføj produkt";
    addProductBtn.type = "button";
    addProductBtn.classList.add("m-submit"); // Reuse button style
    addProductBtn.style.marginTop = "10px"; // Small tweak
    fieldsContainer.appendChild(addProductBtn);

    addProductBtn.addEventListener("click", () => {
        createProductRow();
    });

    // Submit button
    const submitBtn = document.createElement("button");
    submitBtn.textContent = "Opret Levering";
    submitBtn.classList.add("m-submit"); // Reuse submit button style
    wrapper.appendChild(submitBtn);

    // Message
    const msg = document.createElement("div");
    msg.classList.add("m-message"); // Reuse message style
    wrapper.appendChild(msg);

    // Submit logic
    submitBtn.addEventListener("click", async () => {
        const products = [];
        const rows = productListContainer.querySelectorAll(".dm-product-row");
        rows.forEach(row => {
            const productId = row.querySelector("input[type='text']").dataset.productId;
            const qty = parseInt(row.querySelector("input[type='number']").value);
            const warehouse = row.querySelector("select").value;

            if (productId && qty > 0 && warehouse) {
                products.push({ warehouseId: warehouse, productId: productId, quantity: qty });
            }
        });

        if (products.length === 0) {
            msg.textContent = "Tilføj mindst ét produkt med lager.";
            msg.className = "m-message m-error";
            return;
        }

        try {
            const res = await authorizedFetch(
                "http://localhost:8080/api/products/delivery",
                {
                    method: "POST",
                    body: JSON.stringify(products)
                }
            );

            if (!res.ok) {
                msg.textContent = "Fejl: " + (await res.text());
                msg.className = "m-message m-error";
                return;
            }

            msg.textContent = "Leveringen blev oprettet!";
            msg.className = "m-message m-success";

        } catch (err) {
            msg.textContent = "Netværksfejl – kunne ikke oprette levering.";
            msg.className = "m-message m-error";
            console.error(err);
        }
    });

    return wrapper;
}
