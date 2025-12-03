

import {renderDashboard} from "./dashboard.js";
import {createHeader} from "./header.js";
import {isTokenExpired} from "./ReusableFunctions.js";
import {createLandingPage} from "./landingPageModule.js";

const app = document.getElementById("app")



if (isTokenExpired()){

    app.appendChild(createLandingPage())
}else {
    app.appendChild(await createHeader())
    app.appendChild(renderDashboard())
}

