import { authorizedFetch } from "./ReusableFunctions.js";

export function createLowQuantityListModule() {

    const wrapper = document.createElement("div");
    wrapper.classList.add("wq-list");

    const title = document.createElement("h2");
    title.textContent = "Produkter med lav lagerbeholdning";
    title.classList.add("wq-title");
    wrapper.appendChild(title);

    // LIST BOX
    const listBox = document.createElement("div");
    listBox.classList.add("wq-list-box");
    wrapper.appendChild(listBox);

    // MESSAGE BOX (error/success)
    const msg = document.createElement("div");
    msg.classList.add("wq-message");
    wrapper.appendChild(msg);

    async function loadLowQtyProducts() {
        try {
            const res = await authorizedFetch("http://localhost:8080/api/warehouses/lowQty");

            if (!res.ok) {
                msg.textContent = "Kunne ikke hente produkter.";
                msg.classList.add("wq-error");
                return;
            }

            const data = await res.json();

            // Tøm liste
            listBox.innerHTML = "";

            if (data.length === 0) {
                listBox.textContent = "Ingen produkter mangler på lager.";
                return;
            }

            data.forEach(wp => {
                const item = document.createElement("div");
                item.classList.add("wq-item");

                // quantity – product name – warehouse
                item.textContent = `${wp.quantity} stk · ${wp.product.name} (${wp.warehouse.name})`;

                // Rød farve hvis ekstremt lavt (fx < 3)
                if (wp.quantity < 3) item.classList.add("critical");

                listBox.appendChild(item);
            });

        } catch (e) {
            msg.textContent = "Netværksfejl – kunne ikke hente data.";
            msg.classList.add("wq-error");
        }
    }

    // Hent ved første load
    loadLowQtyProducts();

    return wrapper;
}
