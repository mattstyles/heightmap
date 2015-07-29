
import CONSTANTS from './constants'

/**
 * Renders heightmaps
 */
export default class MapRender {
    constructor( options ) {

        let opts = Object.assign({
            width: CONSTANTS.WIDTH,
            height: CONSTANTS.HEIGHT,
            style: CONSTANTS.STYLE
        }, options || {} )

        if ( options && options.style ) {
            opts.style = Object.assign( CONSTANTS.STYLE, opts.style )
        }

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

    // Greyscale
    // 0 <= col <= 1
    renderColor( col ) {
        // Tranform to 0...255
        col = col > 1 ? 1 : col
        let color = ~~( col * 0xff )
        return 'rgb( ' + color + ',' + color + ',' + color + ')'
    }

    clear() {
        this.ctx.clearRect( 0, 0, CONSTANTS.WIDTH, CONSTANTS.HEIGHT )
    }

    render( params ) {

        let opts = Object.assign({
            heightmap: null,
            x: 0,
            y: 0
        }, params )

        if ( !opts.heightmap ) {
            throw new Error( 'heightmap not supplied to render function' )
        }
        // let pixelWidth = CONSTANTS.WIDTH / heightmap.width
        // let pixelHeight = CONSTANTS.HEIGHT / heightmap.height

        for( let j = opts.y; j < opts.y + CONSTANTS.HEIGHT; j++ ) {
            for( let i = opts.x; i < opts.x + CONSTANTS.WIDTH; i++ ) {
                this.ctx.fillStyle = this.renderColor( opts.heightmap.getValue( i, j ) )
                this.ctx.fillRect( i - opts.x, j - opts.y, 1, 1 )
            }
        }
        // heightmap.iterate2d( ( value, x, y ) => {
        //     this.ctx.fillStyle = this.renderColor( value )
        //     this.ctx.fillRect( x * pixelWidth, y * pixelHeight, pixelWidth, pixelHeight )
        // })

    }

}
