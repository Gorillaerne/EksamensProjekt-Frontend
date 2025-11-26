export function isTokenExpired() {
    const token = localStorage.getItem("token");
    if (!token) return true;

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const exp = payload.exp * 1000; // convert seconds → ms
        const expired = Date.now() > exp;

        if (expired) {
            localStorage.removeItem("token");
        }

        return expired;
    } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
        return true; // treat malformed token as expired
    }
}

export async function authorizedFetch(url, options = {}) {
    const token = localStorage.getItem("token");
    const headers = options.headers || {};
    headers["Authorization"] = `Bearer ${token}`;
    headers["Content-Type"] = "application/json";
    const response = await fetch(url, { ...options, headers });
    return response;
}

export function showOverlay(component) {
    // Create overlay background
    const overlay = document.createElement("div");
    overlay.classList.add("lp-overlay");

    // Wrap the component in a box
    const box = document.createElement("div");
    box.classList.add("lp-overlay-box");

    // Insert component into box
    box.appendChild(component);
    overlay.appendChild(box);

    // Close overlay when clicking outside the component
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) overlay.remove();
    });

    // Add to document
    document.body.appendChild(overlay);

    return overlay; // if caller wants to manually close it later
}