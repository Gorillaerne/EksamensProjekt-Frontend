import { authorizedFetch } from "./ReusableFunctions.js";

export function createUserModule() {

    const wrapper = document.createElement("div");
    wrapper.classList.add("m-form");

    const title = document.createElement("h2");
    title.textContent = "Opret Bruger";
    title.classList.add("m-title");
    wrapper.appendChild(title);

    const fieldsContainer = document.createElement("div");
    fieldsContainer.classList.add("m-fields-container");
    wrapper.appendChild(fieldsContainer);

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

    // Username
    const usernameInput = document.createElement("input");
    usernameInput.required = true;
    addField("Brugernavn", usernameInput);

    // Email
    const emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.required = true;
    addField("Email", emailInput);

    // Password
    const passwordInput = document.createElement("input");
    passwordInput.type = "password";
    passwordInput.required = true;
    addField("Kodeord", passwordInput);

    // Role dropdown
    const roleSelect = document.createElement("select");
    ["Admin", "Medarbejder"].forEach(role => {
        const option = document.createElement("option");
        option.value = role.endsWith("Admin") ? "ROLE_ADMIN" : "ROLE_USER";
        option.textContent = role;
        roleSelect.appendChild(option);
    });
    addField("Rolle", roleSelect);

    // Submit button
    const submitBtn = document.createElement("button");
    submitBtn.textContent = "Opret Bruger";
    submitBtn.classList.add("m-submit");
    wrapper.appendChild(submitBtn);

    // Message container
    const msg = document.createElement("div");
    msg.classList.add("m-message");
    wrapper.appendChild(msg);

    // Submit logic
    submitBtn.addEventListener("click", async () => {
        const user = {
            username: usernameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passwordInput.value.trim(),
            role: roleSelect.value
        };

        console.log(user)

        if (!user.username || !user.password || !user.email) {
            msg.textContent = "Brugernavn, email og kodeord skal udfyldes.";
            msg.className = "m-message m-error";
            return;
        }

        try {
            const res = await authorizedFetch(
                "http://localhost:8080/api/users",
                {
                    method: "POST",
                    body: JSON.stringify(user),
                    headers:{
                        "Content-Type": "application/json"
                    }
                }
            );

            if (!res.ok) {
                msg.textContent = "Fejl: " + (await res.text());
                msg.className = "m-message m-error";
                return;
            }

            msg.textContent = "Brugeren blev oprettet!";
            msg.className = "m-message m-success";

            setTimeout(() => location.reload(), 800);

        } catch (err) {
            msg.textContent = "Netværksfejl – kunne ikke oprette brugeren.";
            msg.className = "m-message m-error";
            console.error(err);
        }
    });

    return wrapper;
}
