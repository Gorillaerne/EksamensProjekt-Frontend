import { authorizedFetch } from "./ReusableFunctions.js";

export function createWarehouseModule() {

    const wrapper = document.createElement("div");
    wrapper.classList.add("wm-form");

    const title = document.createElement("h2");
    title.textContent = "Opret varehus";
    title.classList.add("wm-title");
    wrapper.appendChild(title);

    // FLEX ROW (fields left, preview right)
    const contentRow = document.createElement("div");
    contentRow.classList.add("wm-content-row");
    wrapper.appendChild(contentRow);

    // LEFT SIDE (fields)
    const fieldsContainer = document.createElement("div");
    fieldsContainer.classList.add("wm-fields-container");
    contentRow.appendChild(fieldsContainer);

    function addField(labelText, el) {
        const field = document.createElement("div");
        field.classList.add("wm-field");

        const label = document.createElement("label");
        label.textContent = labelText;
        label.classList.add("wm-label");

        el.classList.add("wm-input");

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

    const picInput = document.createElement("input");
    picInput.type = "file";
    picInput.accept = "image/*";
    picInput.classList.add("pm-file-input");
    addField("Billede", picInput);

    let encodedPicture = null;
    const DEFAULT_IMAGE = "/pictures/missing picture.jpg";

    // RIGHT SIDE (preview)
    const previewContainer = document.createElement("div");
    previewContainer.classList.add("wm-preview-container");
    contentRow.appendChild(previewContainer);

    const preview = document.createElement("img");
    preview.src = DEFAULT_IMAGE;
    preview.classList.add("wm-preview");
    previewContainer.appendChild(preview);

    // UPDATE PREVIEW
    picInput.addEventListener("change", function () {
        const file = picInput.files[0];
        if (!file) {
            preview.src = DEFAULT_IMAGE;
            encodedPicture = null;
            return;
        }

        const reader = new FileReader();
        reader.onload = function (ev) {
            encodedPicture = ev.target.result;
            preview.src = encodedPicture;
        };
        reader.readAsDataURL(file);
    });



    // BUTTON
    const submitBtn = document.createElement("button");
    submitBtn.textContent = "Opret Warehouse";
    submitBtn.classList.add("wm-submit");
    wrapper.appendChild(submitBtn);

    // MESSAGE
    const msg = document.createElement("div");
    msg.classList.add("pm-message");
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
            msg.className = "wm-message wm-error";
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
                msg.className = "wm-message wm-error";
                return;
            }

            msg.textContent = "Varehuset blev oprettet!";
            msg.className = "wm-message wm-success";

        } catch (err) {
            msg.textContent = "Netværksfejl – kunne ikke oprette varehuset.";
            msg.className = "wm-message wm-error";
            console.error(err);
        }
    });

    return wrapper;
}
