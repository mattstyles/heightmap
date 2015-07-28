
const CONSTANTS = {
    // WIDTH: window.innerWidth * window.devicePixelRatio,
    // HEIGHT: window.innerHeight * window.devicePixelRatio,
    WIDTH: 512,
    HEIGHT: 512,
    STYLE: {
        'transform': 'scale(' + ( 1 / window.devicePixelRatio ) + ')',
        'transformOrigin': 'top left',
        'position': 'absolute',
        'top': '0px',
        'left': '0px',
        'zIndex': '100'
    },

    NODE: {
        MIN_SIZE: 16,
        MAX_SIZE: 32,
        // 1 is linear, 2 is quadratic (thus favouring smaller sizes)
        SIZE_BIAS: 3.4
    },

    // number of nodes to create
    NUM_NODES: 240,

    // delay between creating nodes
    NODE_CREATE_DELAY: 1,

    // a little buffer when the nodes snap to central structure
    NODE_SNAP_BUFFER: -15,
    NODE_SNAP_VARIANCE: 2,

    // large nodes
    NODE_END_COLOUR: {
        r: 245,
        g: 245,
        b: 245,
        a: .7
    },
    // small nodes
    // NODE_START_COLOUR: {
    //     r: 212,
    //     g: 212,
    //     b: 212
    // },
    NODE_START_COLOUR: {
        r: 21,
        g: 21,
        b: 21,
        a: .2
    },

    // seed params
    SEED: {
        NUM: 2
    }
}


export default CONSTANTS
