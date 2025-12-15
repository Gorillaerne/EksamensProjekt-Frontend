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


        const response = await fetch(""+url, { ...options, headers });

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

export function showNotification(message, type = 'info', duration = 3000) {
    // Create container if it doesn't exist
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        document.body.appendChild(container);
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.classList.add('notification', type);
    notification.textContent = message;
    container.appendChild(notification);

    // Trigger fade-in
    requestAnimationFrame(() => notification.classList.add('show'));

    // Remove notification after duration
    setTimeout(() => {
        notification.classList.remove('show');
        notification.addEventListener('transitionend', () => {
            notification.remove();
            // If it's an error, reload the page
            if (type === 'error') {
                location.reload();
            }
        });
    }, 100000);
}
