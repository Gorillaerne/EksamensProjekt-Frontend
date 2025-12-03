







export function createNewDeliveryModule() {
    // MAIN WRAPPER
    const wrapper = document.createElement("div");
    wrapper.classList.add("dm-form");

    // TITLE
    const title = document.createElement("h2");
    title.textContent = "Opret Levering";
    title.classList.add("dm-title");
    wrapper.appendChild(title);

    // FLEX ROW (fields left, preview or extra info right)
    const contentRow = document.createElement("div");
    contentRow.classList.add("dm-content-row");
    wrapper.appendChild(contentRow);

    // LEFT SIDE (fields)
    const fieldsContainer = document.createElement("div");
    fieldsContainer.classList.add("dm-fields-container");
    contentRow.appendChild(fieldsContainer);

    // Helper function for adding fields
    function addField(labelText, el) {
        const field = document.createElement("div");
        field.classList.add("dm-field");

        const label = document.createElement("label");
        label.textContent = labelText;
        label.classList.add("dm-label");

        el.classList.add("dm-input");

        field.appendChild(label);
        field.appendChild(el);
        fieldsContainer.appendChild(field);
    }

    // INPUTS (example fields for delivery)
    const deliveryDateInput = document.createElement("input");
    deliveryDateInput.type = "date";
    deliveryDateInput.required = true;
    addField("Leveringsdato", deliveryDateInput);

    const addressInput = document.createElement("textarea");
    addressInput.required = true;
    addField("Adresse", addressInput);

    const carrierInput = document.createElement("input");
    addField("Transportør", carrierInput);

    const trackingInput = document.createElement("input");
    addField("Trackingnummer", trackingInput);

    // RIGHT SIDE (optional preview or summary)
    const previewContainer = document.createElement("div");
    previewContainer.classList.add("dm-preview-container");
    contentRow.appendChild(previewContainer);

    const preview = document.createElement("div");
    preview.textContent = "Leveringsoversigt vises her...";
    preview.classList.add("dm-preview");
    previewContainer.appendChild(preview);

    // BUTTON
    const submitBtn = document.createElement("button");
    submitBtn.textContent = "Opret Levering";
    submitBtn.classList.add("dm-submit");
    wrapper.appendChild(submitBtn);

    // MESSAGE
    const msg = document.createElement("div");
    msg.classList.add("dm-message");
    wrapper.appendChild(msg);

    // SUBMIT LOGIC (to be implemented)
    submitBtn.addEventListener("click", async () => {
        const delivery = {
            date: deliveryDateInput.value,
            address: addressInput.value.trim(),
            carrier: carrierInput.value.trim(),
            trackingNumber: trackingInput.value.trim()
        };

        // Basic validation
        if (!delivery.date || !delivery.address) {
            msg.textContent = "Leveringsdato og adresse skal udfyldes.";
            msg.className = "dm-message dm-error";
            return;
        }

        try {
            // Replace with your API call
            const res = await authorizedFetch(
                "http://localhost:8080/api/deliveries",
                {
                    method: "POST",
                    body: JSON.stringify(delivery)
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
