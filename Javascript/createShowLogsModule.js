import {authorizedFetch, showNotification} from "./ReusableFunctions.js";

export function createShowLogModule() {
    const wrapper = document.createElement("div");
    wrapper.classList.add("m-form");

    // TITLE
    const title = document.createElement("h2");
    title.textContent = "Ændrings Historik";
    title.classList.add("m-title");
    wrapper.appendChild(title);

    // --- Top dropdown ---
    const typeSelect = document.createElement("select");
    typeSelect.classList.add("m-input");

    const optDefault = new Option("Vælg log-type...", "", true, true);
    optDefault.disabled = true;

    const optAll = new Option("Alle Logs", "all");
    const optUser = new Option("Bruger Logs", "user");
    const optProduct = new Option("Produkt Logs", "product");

    typeSelect.append(optDefault, optAll, optUser, optProduct);
    wrapper.appendChild(typeSelect);

    // --- Container til under-dropdowns + resultater ---
    const dynamicContainer = document.createElement("div");
    dynamicContainer.classList.add("m-field");
    dynamicContainer.style.marginTop = "20px";
    wrapper.appendChild(dynamicContainer);

    // ------------------- API HELPERS -------------------
    async function fetchAllUsers() {
        const res = await authorizedFetch("/api/users");
        return res.ok ? res.json() :  showNotification(await res.text(),"error",5000);
    }

    async function fetchAllProducts() {
        const res = await authorizedFetch("/api/products");
        return res.ok ? res.json() :  showNotification(await res.text(),"error",5000);
    }

    async function fetchLogsForUser(userId) {
        const res = await authorizedFetch(`/api/logs/user/${userId}`);
        return res.ok ? res.json() :  showNotification(await res.text(),"error",5000);
    }

    async function fetchLogsForProduct(productId) {
        const res = await authorizedFetch(`/api/logs/product/${productId}`);
        return res.ok ? res.json() :  showNotification(await res.text(),"error",5000);
    }

    // ------------------- Tabel-rendering -------------------
    function renderLogs(logs) {
        // Wrapper til scroll
        const scrollWrapper = document.createElement("div");
        scrollWrapper.style.overflowX = "auto"; // vandret scroll
        scrollWrapper.style.marginTop = "10px";

        const table = document.createElement("table");
        table.classList.add("m-table");

        // Header
        const thead = document.createElement("thead");
        thead.innerHTML = `
        <tr>
            <th>Dato</th>
            <th>Tid</th>
            <th>Bruger</th>
            <th>Produkt</th>
            <th>Beskrivelse</th>
        </tr>
    `;
        table.appendChild(thead);

        // Body
        const tbody = document.createElement("tbody");

        if (!logs || logs.length === 0) {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td colspan="5">Ingen logs fundet.</td>`;
            tbody.appendChild(tr);
        } else {
            logs.forEach(log => {
                const tr = document.createElement("tr");

                // Dato og tid
                let dateStr = "-", timeStr = "-";
                if (log.timeStamp) {
                    const dateObj = new Date(log.timeStamp);
                    const day = String(dateObj.getDate()).padStart(2, "0");
                    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
                    const year = dateObj.getFullYear();
                    dateStr = `${day}/${month}/${year}`;

                    const hours = String(dateObj.getHours()).padStart(2, "0");
                    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
                    timeStr = `${hours}:${minutes}`;
                }

                tr.innerHTML = `
                <td>${dateStr}</td>
                <td>${timeStr}</td>
                <td>${log.user?.username || "-"}</td>
                <td>${log.product?.name || "-"}</td>
                <td>${log.action || "-"}</td>
            `;
                tbody.appendChild(tr);
            });
        }

        table.appendChild(tbody);
        scrollWrapper.appendChild(table);
        return scrollWrapper;
    }


    // ------------------- Dropdown logic -------------------
    typeSelect.addEventListener("change", async () => {
        dynamicContainer.innerHTML = ""; // ryd container

        // --- Alle logs ---
        if (typeSelect.value === "all") {
            const res = await authorizedFetch("/api/logs");
            const logs = res.ok ? await res.json() :  showNotification(await res.text(),"error",5000);
            dynamicContainer.appendChild(renderLogs(logs));
            return;
        }

        // --- Bruger logs ---
        if (typeSelect.value === "user") {
            const users = await fetchAllUsers();
            const userSelect = document.createElement("select");
            userSelect.classList.add("m-input");
            userSelect.append(new Option("Vælg bruger...", "", true, true));

            users.forEach(u => {
                userSelect.append(new Option(u.username, u.id));
            });

            dynamicContainer.appendChild(userSelect);

            userSelect.addEventListener("change", async () => {
                const selectedUserId = userSelect.value;
                dynamicContainer.innerHTML = ""; // ryd gamle logs
                dynamicContainer.appendChild(userSelect); // behold dropdown
                dynamicContainer.appendChild(document.createElement("hr"));

                const logs = await fetchLogsForUser(selectedUserId);
                dynamicContainer.appendChild(renderLogs(logs));
            });
            return;
        }

        // --- Produkt logs ---
        if (typeSelect.value === "product") {
            const products = await fetchAllProducts();
            const productSelect = document.createElement("select");
            productSelect.classList.add("m-input");
            productSelect.append(new Option("Vælg produkt...", "", true, true));

            products.forEach(p => {
                productSelect.append(new Option(p.name, p.id));
            });

            dynamicContainer.appendChild(productSelect);

            productSelect.addEventListener("change", async () => {
                const selectedProductId = productSelect.value;
                dynamicContainer.innerHTML = "";
                dynamicContainer.appendChild(productSelect);
                dynamicContainer.appendChild(document.createElement("hr"));

                const logs = await fetchLogsForProduct(selectedProductId);
                dynamicContainer.appendChild(renderLogs(logs));
            });
        }
    });

    return wrapper;
}
