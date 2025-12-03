import { authorizedFetch } from "./ReusableFunctions.js";

export function createWarehouseModule() {

    const wrapper = document.createElement("div");
    wrapper.classList.add("m-form");

    const title = document.createElement("h2");
    title.textContent = "Opret varehus";
    title.classList.add("m-title");
    wrapper.appendChild(title);

    // FLEX ROW (fields left, preview right)
    const contentRow = document.createElement("div");
    contentRow.classList.add("m-content-row");
    wrapper.appendChild(contentRow);

    // LEFT SIDE (fields)
    const fieldsContainer = document.createElement("div");
    fieldsContainer.classList.add("m-fields-container");
    contentRow.appendChild(fieldsContainer);

    function addField(labelText, el) {
        const field = document.createElement("div");
        field.classList.add("m-field");

        const label = document.createElement("label");
        label.textContent = labelText;
        label.classList.add("m-label");

        el.classList.add("m-input");

        field.appendChild(label);
        field.appendChild(el);
        fieldsContainer.appendChild(field);
    }

    // Inputs
    const nameInput = document.createElement("input");
    nameInput.required = true;
    addField("Navn", nameInput);

    const descInput = document.createElement("textarea");
    descInput.required = true;
    addField("Beskrivelse", descInput);

    const addressInput = document.createElement("input");
    addressInput.required = true;
    addField("Adresse", addressInput)




    // BUTTON
    const submitBtn = document.createElement("button");
    submitBtn.textContent = "Opret Warehouse";
    submitBtn.classList.add("m-submit");
    wrapper.appendChild(submitBtn);

    // MESSAGE
    const msg = document.createElement("div");
    msg.classList.add("m-message");
    wrapper.appendChild(msg);

    // SUBMIT LOGIC (unchanged)
    submitBtn.addEventListener("click", async () => {
        const warehouse = {
            name: nameInput.value.trim(),
            description: descInput.value.trim(),
            picture: encodedPicture || DEFAULT_IMAGE,
            address: addressInput.value.trim()
        };

        if (!warehouse.name || !warehouse.description || !warehouse.address) {
            msg.textContent = "Navn, beskrivelse og addresse";
            msg.className = "m-message m-error";
            return;
        }

        try {
            const res = await authorizedFetch(
                "http://localhost:8080/api/warehouses",
                {
                    method: "POST",
                    body: JSON.stringify(warehouse)
                }
            );

            if (!res.ok) {
                msg.textContent = "Fejl: " + (await res.text());
                msg.className = "m-message m-error";
                return;
            }

            msg.textContent = "Varehuset blev oprettet!";
            msg.className = "m-message m-success";

        } catch (err) {
            msg.textContent = "Netværksfejl – kunne ikke oprette varehuset.";
            msg.className = "m-message m-error";
            console.error(err);
        }
    });

    return wrapper;
}
