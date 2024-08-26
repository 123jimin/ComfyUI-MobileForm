// @ts-check

import { createWidgetFromNode } from "./widget.js";

/** @import {ComfyUIApp, ComfyUIGraph, ComfyUIGraphGroup, ComfyUIGraphNode} from "./types.d.ts" */

export class MobileFormUI {
    /** @type {ComfyUIApp} */
    #app;

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
        this.#app = app;
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

            // Maybe find a smarter way...?
            this.setGraph(this.#app.graph);
        } else {
            this.#elem.classList.add("comfy-mobile-form-hidden");
        }
    }

    /**
     * @param {ComfyUIGraph} graph 
     */
    setGraph(graph) {
        const group = graph._groups.filter((g) => g.title.match(/^\s*mobile\s*(?:form|ui)\s*$/i))[0];
        if(!group) return;
        
        const rows = groupNodesByRow(graph._nodes.filter((n) => isGroupContainingNode(group, n)));
        this.#elem.replaceChildren(...rows.map((row) => {
            const row_nodes = row.map((graph_node) => {
                const elem = document.createElement('div');
                
                if(createWidgetFromNode(elem, graph_node)) {
                    return elem;
                } else {
                    return null;
                }
            }).filter((x) => x != null);

            const row_elem = document.createElement('div');
            row_elem.classList.add("comfy-mobile-form-row");
            row_elem.replaceChildren(...row_nodes);

            return row_elem;
        }))
    }
}

/**
 * @param {ComfyUIGraphGroup} group
 * @param {ComfyUIGraphNode} node
 * @returns {boolean}
 */
function isGroupContainingNode(group, node) {
    const [nx, ny] = node.pos;
    const [x, y, w, h] = group._bounding;

    return x <= nx && nx <= x+w && y <= ny && ny <= y+h;
}

/**
 * @param {Array<ComfyUIGraphNode>} nodes
 * @returns {Array<Array<ComfyUIGraphNode>>}
 */
function groupNodesByRow(nodes) {
    if(nodes.length === 0) return [];
    nodes.sort((x, y) => x.pos[1] - y.pos[1]);

    let prev_node = nodes[0];    
    let last_row = [prev_node];
    const rows = [last_row];

    for(const node of nodes.slice(1)) {
        if(node.pos[1] - prev_node.pos[1] >= 10) {
            last_row = [];
            rows.push(last_row);
        }

        last_row.push(node);
        prev_node = node;
    }

    for(const row of rows) {
        row.sort((x, y) => x.pos[0] - y.pos[0]);
    }

    return rows;
}