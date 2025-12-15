import {authorizedFetch, showNotification} from "./ReusableFunctions.js";

export async function createLowQuantityListModule() {

    const wrapper = document.createElement("div");
    wrapper.classList.add("m-form");

    const title = document.createElement("h2");
    title.textContent = "Produkter med lav lagerbeholdning";
    title.classList.add("m-title");
    wrapper.appendChild(title);

    // LIST BOX
    const listBox = document.createElement("div");
    listBox.classList.add("m-form");
    wrapper.appendChild(listBox);


    // MESSAGE BOX (error/success)
    const msg = document.createElement("div");
    msg.classList.add("m-message");
    wrapper.appendChild(msg);

    async function loadLowQtyProducts() {
        try {
            const res = await authorizedFetch("/api/warehouses/lowQty");

            if (!res.ok) {
                return showNotification(await res.text(),"error",5000);
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
                item.classList.add("m-item");
                console.log(wp)

                // quantity – product name – warehouse
                item.textContent = `${wp.quantity} stk · ${wp.productName} (${wp.warehouseName})`;

                // Rød farve hvis ekstremt lavt (fx < 3)
                if (wp.quantity < 3) item.classList.add("critical");

                listBox.appendChild(item);
            });

        } catch
            (e) {
            return showNotification("Netværksfejl – kunne ikke hente data.","error",5000);
        }
    }

    // Hent ved første load
   await loadLowQtyProducts()

    return wrapper;
}
