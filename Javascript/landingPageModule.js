import {isTokenExpired, showOverlay} from "./ReusableFunctions.js";
import {createLoginModule} from "./loginModule.js";

export function createLandingPage() {

    const wrapper = document.createElement("div");
    wrapper.classList.add("lp-wrapper");

    /* ---------------------- HEADER ---------------------- */
    const header = document.createElement("header");
    header.classList.add("lp-header");

    const logo = document.createElement("img");
    logo.src = "pictures/elvangLogo.png"
    logo.classList.add("lp-logo");

    const tokenExpired = isTokenExpired()
    let navBtn;
    if (tokenExpired){
        navBtn = document.createElement("div")
        navBtn.textContent ="Login"
        navBtn.classList.add("lp-login-btn")
        navBtn.addEventListener("click",function (){
            showOverlay(createLoginModule())
        })

    }else {
        navBtn = document.createElement("div");
        navBtn.textContent = "Dashboard";
        navBtn.classList.add("lp-nav-btn");
    }



    header.appendChild(logo);
    header.appendChild(navBtn);

    wrapper.appendChild(header);

    /* ---------------------- HERO SECTION ---------------------- */
    const hero = document.createElement("section");
    hero.classList.add("lp-hero");

    const heroLeft = document.createElement("div");
    heroLeft.classList.add("lp-hero-left");

    const heroTitle = document.createElement("h1");
    heroTitle.textContent = "Elvang Lagerstyringssystem";

    const heroQuote = document.createElement("p");
    heroQuote.textContent = "“Fordi et godt overblik baner vej for gode og bæredygtige beslutninger”";

    heroLeft.appendChild(heroTitle);
    heroLeft.appendChild(heroQuote);

    const heroRight = document.createElement("img");
    heroRight.src = "/pictures/elvang.jpg"; // Put your own path here
    heroRight.classList.add("lp-hero-img");

    hero.appendChild(heroLeft);
    hero.appendChild(heroRight);
    wrapper.appendChild(hero);

    /* ---------------------- STORY SECTION ---------------------- */
    const story = document.createElement("section");
    story.classList.add("lp-story");

    const storyImg = document.createElement("img");
    storyImg.src = "/pictures/elvangv2.jpg"; // Replace with real path
    storyImg.classList.add("lp-story-img");

    const storyText = document.createElement("p");
    storyText.classList.add("lp-story-text");
    storyText.textContent =
        "Vores historie handler om etik, integritet og respekt. Den begyndte i 2002, da vores grundlæggere Tina og Lasse Elvang lærte om alpakauldens kvaliteter under en rygsækrejse til Peru. De blev betagede af uldens blødhed og holdbarhed, og begyndte at lege med at kombinere afdæmpet æstetisk design stil med århundred gammel peruviansk vævertraditioner og skabe hermed stærke relationer til håndværkere, samfundsprojekter og fabrikker. Et år senere blev Elvang født og blev den første virksomhed, der introducerede plaider lavet af alpakauld i Skandinavien.";

    story.appendChild(storyImg);
    story.appendChild(storyText);

    wrapper.appendChild(story);

    /* ---------------------- FOOTER ---------------------- */
    const footer = document.createElement("footer");
    footer.classList.add("lp-footer");

    wrapper.appendChild(footer);

    return wrapper;
}
