
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
            opts.style = Object.assign( opts.style, options.style )
        }

        // New canvas
        const canvas = document.createElement( 'canvas' )
        this.ctx = canvas.getContext( '2d' )
        canvas.setAttribute( 'id', 'render' )
        canvas.setAttribute( 'width', opts.width )
        canvas.setAttribute( 'height', opts.height )
        Object.keys( opts.style ).forEach( style => {
            canvas.style[ style ] = CONSTANTS.STYLE[ style ]
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

    render( heightmap ) {
        // let pixelWidth = CONSTANTS.WIDTH / heightmap.width
        // let pixelHeight = CONSTANTS.HEIGHT / heightmap.height

        for( let y = 0; y < CONSTANTS.HEIGHT; y++ ) {
            for( let x = 0; x < CONSTANTS.WIDTH; x++ ) {
                this.ctx.fillStyle = this.renderColor( heightmap.getValue( x, y ) )
                this.ctx.fillRect( x, y, 1, 1 )
            }
        }
        // heightmap.iterate2d( ( value, x, y ) => {
        //     this.ctx.fillStyle = this.renderColor( value )
        //     this.ctx.fillRect( x * pixelWidth, y * pixelHeight, pixelWidth, pixelHeight )
        // })

    }

}
