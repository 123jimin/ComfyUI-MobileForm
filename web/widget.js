// @ts-check

/** @import {ComfyUIGraphNode, ComfyUIGraphWidget} from "./types" */

/**
 * @param {HTMLDivElement} elem 
 * @param {ComfyUIGraphNode} node 
 * @returns {boolean}
 */
export function createWidgetFromNode(elem, node) {
    elem.classList.add("comfy-mobile-form-widget");
    
    switch(node.type) {
        case 'PrimitiveNode': {
            if(!Array.isArray(node.widgets)) return false;

            for(const widget of node.widgets) {
                if(widget.name === 'value') {
                    addTitle(elem, node.title);
                    addWidget(elem, widget);
                    return true;
                }
            }

            break;
        }
        case 'Note': {
            if(!Array.isArray(node.widgets)) return false;

            for(const widget of node.widgets) {
                if(widget.type === 'customtext') {
                    addTextNote(elem, widget);
                    return true;
                }
            }
            break;
        }
        default: {
            if(!Array.isArray(node.widgets)) return false;
            
            addTitle(elem, node.title);

            const group_elem = document.createElement('div');
            group_elem.classList.add("comfy-mobile-form-group");
            elem.appendChild(group_elem);

            for(const widget of node.widgets) {
                addTitle(group_elem, widget.name);
                addWidget(group_elem, widget);
            }

            if(node.widgets.length >= 3) {
                let opened = false;
                group_elem.classList.add("comfy-mobile-form-hidden");
    
                const toggle_button = document.createElement('button');
                toggle_button.textContent = "Expand";
                toggle_button.addEventListener('click', () => {
                    opened = !opened;
                    toggle_button.textContent = opened ? "Close" : "Expand";
    
                    if(opened) {
                        group_elem.classList.remove("comfy-mobile-form-hidden");
                    } else {
                        group_elem.classList.add("comfy-mobile-form-hidden");
                    }
                });
    
                elem.appendChild(toggle_button);
            }

            return true;
        }
    }

    return false;
}

/**
 * @param {HTMLDivElement} elem 
 * @param {string} title 
 */
export function addTitle(elem, title) {
    const label_elem = document.createElement('label');
    label_elem.textContent = title;
    elem.appendChild(label_elem);
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

    selected_elem.value = widget.value;

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

/**
 * @param {HTMLDivElement} elem 
 * @param {{type: 'customtext', value: string}} widget 
 */
export function addTextNote(elem, widget) {
    const text_elem = document.createElement('span');
    text_elem.textContent = widget.value;
    elem.appendChild(text_elem);
}
