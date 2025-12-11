import { authorizedFetch } from "./ReusableFunctions.js";

export function createProductTransferModule() {

    const wrapper = document.createElement("div");
    wrapper.classList.add("m-form");

    const title = document.createElement("h2");
    title.textContent = "Flyt produkt mellem lagre";
    title.classList.add("m-title");
    wrapper.appendChild(title);

    // CONTAINER
    const content = document.createElement("div");
    content.classList.add("m-fields-container");
    wrapper.appendChild(content);

    function addField(labelText, el) {
        const field = document.createElement("div");
        field.classList.add("m-field");

        const label = document.createElement("label");
        label.textContent = labelText;
        label.classList.add("m-label");

        el.classList.add("m-input");

        field.appendChild(label);
        field.appendChild(el);
        content.appendChild(field);
    }

    // INPUT ELEMENTS
    const productSelect = document.createElement("select");
    addField("Vælg produkt", productSelect);

    const fromSelect = document.createElement("select");
    addField("Fra varehus", fromSelect);

    const toSelect = document.createElement("select");
    addField("Til varehus", toSelect);

    const amountInput = document.createElement("input");
    amountInput.type = "number";
    amountInput.min = "1";
    amountInput.required = true;
    addField("Antal", amountInput);

    // 🚨 QUANTITY DISPLAY
    const stockBox = document.createElement("div");
    stockBox.classList.add("m-stock-display");
    stockBox.textContent = "Lagerbeholdning: -";
    content.appendChild(stockBox);

    async function updateStockDisplay() {
        const productId = productSelect.value;
        const warehouseId = fromSelect.value;

        // Mangler valg → blank visning
        if (!productId || !warehouseId) {
            stockBox.textContent = "Lagerbeholdning: -";
            return;
        }

        try {
            const res = await authorizedFetch(
                `http://localhost:8080/api/warehousetransfer/${warehouseId}/product/${productId}/quantity`
            );
            const qty = await res.json();
            stockBox.textContent = `Lagerbeholdning: ${qty}`;
        } catch (err) {
            stockBox.textContent = "Lagerbeholdning: N/A";
        }
    }

    // FETCH DATA (products & warehouses)
    async function loadData() {
        try {
            const prodRes = await authorizedFetch("http://localhost:8080/api/products");
            const products = await prodRes.json();
            products.forEach(p => {
                const opt = document.createElement("option");
                opt.value = p.id;
                opt.textContent = p.name;
                productSelect.appendChild(opt);
            });

            const whRes = await authorizedFetch("http://localhost:8080/api/warehouses");
            const warehouses = await whRes.json();
            warehouses.forEach(w => {
                const opt1 = document.createElement("option");
                const opt2 = document.createElement("option");
                opt1.value = opt2.value = w.id;
                opt1.textContent = opt2.textContent = w.name;

                fromSelect.appendChild(opt1);
                toSelect.appendChild(opt2);
            });

            // Når hentet → prøv at vise initial stock
            updateStockDisplay();
        } catch (err) {
            msg.textContent = "Kunne ikke hente data fra server.";
            msg.className = "m-message m-error";
        }
    }
    loadData();

    // 🎯 Også opdater beholdning ved valg
    productSelect.addEventListener("change", updateStockDisplay);
    fromSelect.addEventListener("change", updateStockDisplay);

    // MESSAGE BOX
    const msg = document.createElement("div");
    msg.classList.add("m-message");
    wrapper.appendChild(msg);

    // SUBMIT BUTTON
    const submitBtn = document.createElement("button");
    submitBtn.textContent = "Flyt produkt";
    submitBtn.classList.add("m-submit");
    wrapper.appendChild(submitBtn);

    submitBtn.addEventListener("click", async () => {

        const request = {
            productId: productSelect.value,
            fromWarehouseId: fromSelect.value,
            toWarehouseId: toSelect.value,
            amount: parseInt(amountInput.value)
        };

        if (!request.productId || !request.fromWarehouseId || !request.toWarehouseId || !request.amount) {
            msg.textContent = "Udfyld alle felter.";
            msg.className = "m-message m-error";
            return;
        }

        if (request.fromWarehouseId === request.toWarehouseId) {
            msg.textContent = "Fra og til lager må ikke være det samme.";
            msg.className = "m-message m-error";
            return;
        }

        try {
            const res = await authorizedFetch("http://localhost:8080/api/warehousetransfer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(request)
            });


            if (!res.ok) {
                msg.textContent = "Fejl: " + (await res.text());
                msg.className = "m-message m-error";
                return;
            }

            msg.textContent = "Produktet blev flyttet!";
            msg.className = "m-message m-success";

            amountInput.value = "";
            updateStockDisplay(); // 🔄 Opdatér beholdning efter flytning

        } catch (err) {
            msg.textContent = "Netværksfejl – kunne ikke flytte produktet.";
            msg.className = "m-message m-error";
        }
    });

    return wrapper;
}
