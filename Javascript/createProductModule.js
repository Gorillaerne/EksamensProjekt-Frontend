import { authorizedFetch } from "./ReusableFunctions.js";

export function createProductModule() {

    const wrapper = document.createElement("div");
    wrapper.classList.add("m-form");

    const title = document.createElement("h2");
    title.textContent = "Opret Produkt";
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

    const picInput = document.createElement("input");
    picInput.type = "file";
    picInput.accept = "image/*";
    picInput.classList.add("pm-file-input");
    addField("Billede", picInput);

    let encodedPicture = null;
    const DEFAULT_IMAGE = "/pictures/missing picture.jpg";

    // RIGHT SIDE (preview)
    const previewContainer = document.createElement("div");
    previewContainer.classList.add("m-preview-container");
    contentRow.appendChild(previewContainer);

    const preview = document.createElement("img");
    preview.src = DEFAULT_IMAGE;
    preview.classList.add("m-preview");
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

    const skuInput = document.createElement("input");
    addField("SKU (unik)", skuInput);

    const priceInput = document.createElement("input");
    priceInput.type = "number";
    priceInput.step = "0.01";
    addField("Pris", priceInput);

    // BUTTON
    const submitBtn = document.createElement("button");
    submitBtn.textContent = "Opret Produkt";
    submitBtn.classList.add("m-submit");
    wrapper.appendChild(submitBtn);

    // MESSAGE
    const msg = document.createElement("div");
    msg.classList.add("m-message");
    wrapper.appendChild(msg);

    // SUBMIT LOGIC (unchanged)
    submitBtn.addEventListener("click", async () => {
        const product = {
            name: nameInput.value.trim(),
            description: descInput.value.trim(),
            picture: encodedPicture || DEFAULT_IMAGE,
            sku: skuInput.value.trim(),
            price: priceInput.value ? parseFloat(priceInput.value) : null
        };

        if (!product.name || !product.description || !product.price) {
            msg.textContent = "Navn, beskrivelse og pris skal udfyldes.";
            msg.className = "m-message m-error";
            return;
        }

        try {
            const res = await authorizedFetch(
                "http://localhost:8080/api/products",
                {
                    method: "POST",
                    body: JSON.stringify(product)
                }
            );

            if (!res.ok) {
                msg.textContent = "Fejl: " + (await res.text());
                msg.className = "m-message m-error";
                return;
            }

            msg.textContent = "Produktet blev oprettet!";
            msg.className = "m-message m-success";

        } catch (err) {
            msg.textContent = "Netværksfejl – kunne ikke oprette produktet.";
            msg.className = "m-message m-error";
            console.error(err);
        }
    });

    return wrapper;
}
