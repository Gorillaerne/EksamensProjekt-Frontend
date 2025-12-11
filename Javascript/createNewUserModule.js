import {authorizedFetch, showNotification} from "./ReusableFunctions.js";

export function createUserModule() {
    const wrapper = document.createElement("div");
    wrapper.classList.add("um-wrapper");

    const title = document.createElement("h2");
    title.textContent = "Bruger Administration";
    title.classList.add("um-title");
    wrapper.appendChild(title);

    // Main content row: left = create user, right = list users
    const contentRow = document.createElement("div");
    contentRow.classList.add("um-content");
    wrapper.appendChild(contentRow);

    /* ---------------- CREATE USER SECTION ---------------- */
    const createWrapper = document.createElement("div");
    createWrapper.classList.add("um-form");
    contentRow.appendChild(createWrapper);

    function addField(labelText, el, parent = createWrapper) {
        const field = document.createElement("div");
        field.classList.add("um-field");

        const label = document.createElement("label");
        label.textContent = labelText;
        label.classList.add("um-label");

        el.classList.add("um-input");

        field.appendChild(label);
        field.appendChild(el);
        parent.appendChild(field);
    }

    const usernameInput = document.createElement("input");
    usernameInput.required = true;
    addField("Brugernavn", usernameInput);

    const emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.required = true;
    addField("Email", emailInput);

    const passwordInput = document.createElement("input");
    passwordInput.type = "password";
    passwordInput.required = true;
    addField("Kodeord", passwordInput);

    const roleSelect = document.createElement("select");
    roleSelect.classList.add("um-select");
    ["Admin", "Medarbejder"].forEach(role => {
        const option = document.createElement("option");
        option.value = role.endsWith("Admin") ? "ROLE_ADMIN" : "ROLE_USER";
        option.textContent = role;
        roleSelect.appendChild(option);
    });
    addField("Rolle", roleSelect);

    const submitBtn = document.createElement("button");
    submitBtn.textContent = "Opret Bruger";
    submitBtn.classList.add("um-submit");
    createWrapper.appendChild(submitBtn);

    const msg = document.createElement("div");
    msg.classList.add("m-message");
    createWrapper.appendChild(msg);

    /* ---------------- USER LIST SECTION ---------------- */
    const listWrapper = document.createElement("div");
    listWrapper.classList.add("um-list-wrapper");
    contentRow.appendChild(listWrapper);

    const userListWrapper = document.createElement("div");
    listWrapper.appendChild(userListWrapper);

    async function loadUsers() {
        try {
            const res = await authorizedFetch("/api/users");
            if (!res.ok) return showNotification(await res.text(),"error",5000);

            const users = await res.json();
            userListWrapper.innerHTML = "";

            users.forEach(user => {
                const userCard = document.createElement("div");
                userCard.classList.add("um-user-card");

                const info = document.createElement("div");
                info.classList.add("um-user-info");

                const name = document.createElement("div");
                name.classList.add("um-user-name");
                name.textContent = `${user.username} (${user.email})`;

                const role = document.createElement("div");
                role.classList.add("um-user-role");
                role.textContent = `Rolle: ${user.role}`;

                info.appendChild(name);
                info.appendChild(role);

                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "Slet";
                deleteBtn.classList.add("um-delete-btn");
                deleteBtn.addEventListener("click", async () => {
                    if (!confirm(`Er du sikker på, du vil slette ${user.username}?`)) return;
                    try {
                        const delRes = await authorizedFetch(`/api/users/${user.id}`, { method: "DELETE" });
                        if (!delRes.ok)return  showNotification(await delRes.text(),"error",5000);
                        loadUsers();
                    } catch (err) {
                        showNotification("Netværksfejl - kunne ikke oprette forbindelse til backend","error",5000)
                        console.error(err);
                    }
                });

                userCard.appendChild(info);
                userCard.appendChild(deleteBtn);
                userListWrapper.appendChild(userCard);
            });
        } catch (err) {
            showNotification("Netværksfejl - kunne ikke oprette forbindelse til backend","error",5000)
            console.error(err);
        }
    }

    loadUsers();

    submitBtn.addEventListener("click", async () => {
        const user = {
            username: usernameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passwordInput.value.trim(),
            role: roleSelect.value
        };

        if (!user.username || !user.password || !user.email) {
            msg.textContent = "Brugernavn, email og kodeord skal udfyldes.";
            msg.className = "m-message m-error";
            return;
        }

        try {
            const res = await authorizedFetch("/api/users", {
                method: "POST",
                body: JSON.stringify(user),
                headers: { "Content-Type": "application/json" }
            });

            if (!res.ok) {
               return showNotification(await res.text(),"error",5000)
            }

            msg.textContent = "Brugeren blev oprettet!";
            msg.className = "m-message m-success";

            usernameInput.value = "";
            emailInput.value = "";
            passwordInput.value = "";
            roleSelect.value = "ROLE_USER";

            loadUsers();
        } catch (err) {
            showNotification("Netværksfejl – kunne ikke oprette forbindelse til backend","error",5000)
            console.error(err);
        }
    });

    return wrapper;
}
