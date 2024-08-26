export type ComfyUIApp = any;

export interface ComfyUIGraph {
    _groups: ComfyUIGraphGroup[];
    _nodes: ComfyUIGraphNode[];
}

export interface ComfyUIGraphGroup {
    title: string;
    _bounding: Float32Array;
}

export interface ComfyUIGraphNode {
    title: string;
    type: string;
    pos: Float32Array;
    size: Float32Array;
    widgets?: ComfyUIGraphWidget[];
}

export type ComfyUIGraphWidget = any;