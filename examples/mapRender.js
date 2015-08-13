
import CONSTANTS from './constants'
import { clamp } from './util'

/**
 * Renders heightmaps
 */
export default class MapRender {
    /**
     * @constructs
     * @param options <Object>
     *   @param width <Integer> width to render
     *   @param height <Integer> height to render
     *   @param style <Object> style to apply to canvas
     */
    constructor( options ) {

        let opts = Object.assign({
            width: CONSTANTS.WIDTH,
            height: CONSTANTS.HEIGHT,
            style: CONSTANTS.STYLE
        }, options || {} )

        if ( options && options.style ) {
            opts.style = Object.assign( CONSTANTS.STYLE, opts.style )
        }

        this.width = opts.width
        this.height = opts.height

        // New canvas
        const canvas = document.createElement( 'canvas' )
        this.ctx = canvas.getContext( '2d' )
        canvas.setAttribute( 'id', 'render' )
        canvas.setAttribute( 'width', opts.width )
        canvas.setAttribute( 'height', opts.height )
        Object.keys( opts.style ).forEach( style => {
            canvas.style[ style ] = opts.style[ style ]
        })
        document.body.appendChild( canvas )
    }

    /**
     * Transform 0...1 of the heightmap to 0...255 for grayscale colors
     * @param value <Float>
     */
    renderColor( value ) {
        let color = clamp( value, 0, 1 ) * 0xff | 0
        return 'rgb( ' + color + ',' + color + ',' + color + ')'
    }

    /**
     * Clears the canvas
     */
    clear() {
        this.ctx.clearRect( 0, 0, CONSTANTS.WIDTH, CONSTANTS.HEIGHT )
    }

    /**
     * Renders a given heightmap
     * @param parameters <Object>
     *   @param heightmap <HeightMap> the heightmap function to render
     *   @param x <Integer> world coord
     *   @param y <Integer> world coord
     */
    render( parameters ) {

        let params = Object.assign({
            heightmap: null,
            x: 0,
            y: 0
        }, parameters )

        if ( !params.heightmap ) {
            throw new Error( 'heightmap not supplied to render function' )
        }

        // Convert from world space to local space
        for( let j = params.y; j < params.y + this.height; j++ ) {
            for( let i = params.x; i < params.x + this.width; i++ ) {
                this.ctx.fillStyle = this.renderColor( params.heightmap.getValue( i, j ) )
                this.ctx.fillRect( i - params.x, j - params.y, 1, 1 )
            }
        }
    }
}
