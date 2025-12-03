import { authorizedFetch } from "./ReusableFunctions.js";

export function createNewDeliveryModule() {
    // MAIN WRAPPER
    const wrapper = document.createElement("div");
    wrapper.classList.add("dm-form");

    // TITLE
    const title = document.createElement("h2");
    title.textContent = "Opret Levering";
    title.classList.add("dm-title");
    wrapper.appendChild(title);

    // FLEX ROW
    const contentRow = document.createElement("div");
    contentRow.classList.add("dm-content-row");
    wrapper.appendChild(contentRow);

    // LEFT SIDE (fields)
    const fieldsContainer = document.createElement("div");
    fieldsContainer.classList.add("dm-fields-container");
    contentRow.appendChild(fieldsContainer);

    // Helper function for adding fields
    function addField(labelText, el, container = fieldsContainer) {
        const field = document.createElement("div");
        field.classList.add("dm-field");

        const label = document.createElement("label");
        label.textContent = labelText;
        label.classList.add("dm-label");

        el.classList.add("dm-input");

        field.appendChild(label);
        field.appendChild(el);
        container.appendChild(field);
    }

    // PRODUCT LIST CONTAINER
    const productListContainer = document.createElement("div");
    productListContainer.classList.add("dm-product-list");
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
                console.log(allWarehouses)
            }
        } catch (err) {
            console.error("Fejl ved preload:", err);
        }
    }

    // Function to create a product row
    function createProductRow() {
        const row = document.createElement("div");
        row.classList.add("dm-product-row");

        // Product search input
        const productInput = document.createElement("input");
        productInput.type = "text";
        productInput.placeholder = "Søg produkt...";
        productInput.required = true;
        addField("Produkt", productInput, row);

        // Autocomplete dropdown
        const suggestionBox = document.createElement("div");
        suggestionBox.classList.add("dm-suggestions");
        row.appendChild(suggestionBox);

        // Filter products from preloaded list
        productInput.addEventListener("input", () => {
            const query = productInput.value.trim().toLowerCase();
            suggestionBox.innerHTML = "";

            if (query.length < 1) return;

            const matches = allProducts.filter(p => p.name.toLowerCase().includes(query));
            matches.forEach(prod => {
                const item = document.createElement("div");
                item.classList.add("dm-suggestion-item");
                item.textContent = prod.name;
                item.addEventListener("click", () => {
                    productInput.value = prod.name;
                    productInput.dataset.productId = prod.id;
                    suggestionBox.innerHTML = "";
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

        // Warehouse select for this product
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
    addProductBtn.classList.add("dm-add-product");
    fieldsContainer.appendChild(addProductBtn);

    addProductBtn.addEventListener("click", () => {
        createProductRow();
    });

    // BUTTON
    const submitBtn = document.createElement("button");
    submitBtn.textContent = "Opret Levering";
    submitBtn.classList.add("dm-submit");
    wrapper.appendChild(submitBtn);

    // MESSAGE
    const msg = document.createElement("div");
    msg.classList.add("dm-message");
    wrapper.appendChild(msg);

    // SUBMIT LOGIC
    submitBtn.addEventListener("click", async () => {
        const products = [];
        const rows = productListContainer.querySelectorAll(".dm-product-row");
        rows.forEach(row => {
            const productId = row.querySelector("input[type='text']").dataset.productId;
            const qty = parseInt(row.querySelector("input[type='number']").value);
            const warehouse = row.querySelector("select").value;

            if (productId && qty > 0 && warehouse) {
                products.push({ productId, quantity: qty, warehouse });
            }
        });

        if (products.length === 0) {
            msg.textContent = "Tilføj mindst ét produkt med lager.";
            msg.className = "dm-message dm-error";
            return;
        }

        try {
            const res = await authorizedFetch(
                "http://localhost:8080/api/deliveries",
                {
                    method: "POST",
                    body: JSON.stringify({ products })
                }
            );

            if (!res.ok) {
                msg.textContent = "Fejl: " + (await res.text());
                msg.className = "dm-message dm-error";
                return;
            }

            msg.textContent = "Leveringen blev oprettet!";
            msg.className = "dm-message dm-success";

        } catch (err) {
            msg.textContent = "Netværksfejl – kunne ikke oprette levering.";
            msg.className = "dm-message dm-error";
            console.error(err);
        }
    });

    return wrapper;
}
