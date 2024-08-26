// @ts-check

// @ts-ignore
import { app } from "../../scripts/app.js";
import { MobileFormUI } from "./ui.js";

function createToolbarButton() {
    const button = document.createElement('button');
    button.classList.add(..."comfy-mobile-form-sidebar-toggle p-button p-component p-button-icon-only p-button-text side-bar-button p-button-secondary".split(' '));

    const button_icon = document.createElement('i');
    button_icon.classList.add(..."pi pi-mobile side-bar-button-icon".split(' '));

    const button_label = document.createElement('span');
    button_label.classList.add("p-button-label");
    button.replaceChildren(button_icon, button_label);

    return button;
}

const log = console.log.bind(console, "[MobileForm]");

const BASE_PATH = import.meta.url.replace(/\/[^/]*$/, "");

/** @type {MobileFormUI} */
let ui;

app.registerExtension({
    name: "MobileForm",
    async init(app) {
        log("Initializing...");

        const style_elem = document.createElement('link');
        style_elem.rel = "stylesheet";
        style_elem.href = `${BASE_PATH}/style.css`;
        document.head.appendChild(style_elem);

        const ui_root_elem = document.createElement('div');
        ui = new MobileFormUI(app, ui_root_elem);

        document.querySelector(".graph-canvas-container")?.appendChild(ui_root_elem);
    },
    async setup(_) {
        const toolbar_end = /** @type {HTMLDivElement|null} */ (document.querySelector("div.side-tool-bar-end"));
        if(toolbar_end) {
            const toolbar_button = createToolbarButton();
            toolbar_button.addEventListener('click', () => {
                ui.toggleVisible();
                
                for(const textarea of document.querySelectorAll(".graph-canvas-container>.comfy-multiline-input")) {
                    if(ui.visible) textarea.classList.add("comfy-mobile-form-hidden");
                    else textarea.classList.remove("comfy-mobile-form-hidden");
                }
            });

            toolbar_end.insertBefore(toolbar_button, toolbar_end.firstChild);
        }
    },
    async afterConfigureGraph(_, app) {},
});