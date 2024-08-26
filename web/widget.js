// @ts-check

/** @import {ComfyUIGraphNode, ComfyUIGraphWidget} from "./types" */

/**
 * @param {HTMLDivElement} elem 
 * @param {ComfyUIGraphNode} node 
 * @returns {boolean}
 */
export function createWidgetFromNode(elem, node) {
    elem.classList.add("comfy-mobile-form-widget");
    
    const label_elem = document.createElement('label');
    label_elem.textContent = node.title;
    elem.appendChild(label_elem);

    switch(node.type) {
        case 'PrimitiveNode': {
            if(!Array.isArray(node.widgets)) return false;

            for(const widget of node.widgets) {
                if(widget.name === 'value') {
                    addWidget(elem, widget);
                    return true;
                }
            }

            break;
        }
    }

    console.warn("[MobileForm]", "Unknown node:", node);
    return false;
}

/**
 * @param {HTMLDivElement} elem 
 * @param {ComfyUIGraphWidget} widget 
 */
export function addWidget(elem, widget) {
    switch(widget.type) {
        case 'combo': addComboWidget(elem, widget); break;
        case 'number': addNumberWidget(elem, widget); break;
        case 'customtext': addCustomTextWidget(elem, widget); break;
        default: console.warn("[MobileForm]", "Unknown widget:", widget);
    }
}

/**
 * @param {HTMLDivElement} elem 
 * @param {{type: 'combo', value: string, options: {values: string[]}}} widget 
 */
export function addComboWidget(elem, widget) {
    const select_elem = document.createElement('select');
    select_elem.replaceChildren(...widget.options.values.map((value) => {
        const option_elem = document.createElement('option');
        option_elem.value = value;
        option_elem.textContent = value;
        return option_elem;
    }));

    elem.appendChild(select_elem);

    select_elem.addEventListener('change', () => {
        widget.value = select_elem.value;
    })
}

/**
 * @param {HTMLDivElement} elem 
 * @param {{type: 'number', value: number}} widget 
 */
export function addNumberWidget(elem, widget) {
    const input_elem = document.createElement('input');
    input_elem.type = 'number';
    input_elem.value = `${widget.value}`;
    elem.appendChild(input_elem);

    input_elem.addEventListener('change', () => {
        widget.value = parseFloat(input_elem.value);
    });
}

/**
 * @param {HTMLDivElement} elem 
 * @param {{type: 'customtext', value: string}} widget 
 */
export function addCustomTextWidget(elem, widget) {
    const textarea_elem = document.createElement('textarea');
    textarea_elem.value = widget.value;
    elem.appendChild(textarea_elem);

    textarea_elem.addEventListener('change', () => {
        widget.value = textarea_elem.value;
    });
}