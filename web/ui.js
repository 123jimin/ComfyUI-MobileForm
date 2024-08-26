// @ts-check

/** @typedef {any} ComfyUIApp */
/** @typedef {any} ComfyUIGraph */

export class MobileFormUI {
    /** @type {HTMLDivElement} */
    #elem;

    /** @type {boolean} */
    #visible = false;
    get visible() { return this.#visible; }

    /**
     * @param {ComfyUIApp} app 
     * @param {HTMLDivElement} elem 
     */
    constructor(app, elem) {
        this.#elem = elem;

        elem.classList.add("comfy-mobile-form");
        if(!this.#visible) {
            elem.classList.add("comfy-mobile-form-hidden")
        }
    }

    toggleVisible() {
        this.#visible = !this.#visible;
        if(this.#visible) {
            this.#elem.classList.remove("comfy-mobile-form-hidden");
        } else {
            this.#elem.classList.add("comfy-mobile-form-hidden");
        }
    }

    /**
     * @param {ComfyUIGraph} graph 
     */
    setGraph(graph) {

    }
}