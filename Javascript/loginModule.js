import { authorizedFetch } from "./ReusableFunctions.js";

export function createLoginModule() {

    const wrapper = document.createElement("div");
    wrapper.classList.add("m-form");

    // TITLE
    const title = document.createElement("h2");
    title.textContent = "Login";
    title.classList.add("m-title");
    wrapper.appendChild(title);

    // FIELDS CONTAINER
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

    // INPUTS
    const usernameInput = document.createElement("input");
    usernameInput.required = true;
    addField("Brugernavn", usernameInput);

    const passwordInput = document.createElement("input");
    passwordInput.type = "password";
    passwordInput.required = true;
    addField("Kodeord", passwordInput);

    // BUTTON
    const loginBtn = document.createElement("button");
    loginBtn.textContent = "Login";
    loginBtn.classList.add("m-submit");
    wrapper.appendChild(loginBtn);

    // MESSAGE
    const msg = document.createElement("div");
    msg.classList.add("m-message");
    wrapper.appendChild(msg);

    // SUBMIT LOGIC
    loginBtn.addEventListener("click", async () => {

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            msg.textContent = "Udfyld brugernavn og kodeord.";
            msg.className = "m-message m-error";
            return;
        }

        const loginPayload = { username, password };

        try {
            const res = await authorizedFetch(
                "http://localhost:8080/api/users/login",
                {
                    method: "POST",
                    body: JSON.stringify(loginPayload)
                }
            );

            if (!res.ok) {
                msg.textContent = "Login fejlede: " + (await res.text());
                msg.className = "m-message m-error";
                return;
            }

            const data = await res.json();

            // Example: Save token to localStorage
            if (data.token) {
                localStorage.setItem("token", data.token);
            }

            msg.textContent = "Login succes!";
            msg.className = "m-message m-success";

            setTimeout(() => {
                location.reload();
            }, 300);

        } catch (err) {
            msg.textContent = "Netværksfejl – kunne ikke logge ind.";
            msg.className = "m-message m-error";
            console.error(err);
        }
    });

    return wrapper;
}
