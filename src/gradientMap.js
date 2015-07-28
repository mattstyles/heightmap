
import { Color, Point } from './util'

export default class GradMap {
    constructor( options ) {
        this.map = []

        let opts = Object.assign({
            width: 512,
            height: 512
        }, options || {} )

        this.width = opts.width
        this.height = opts.height

        let canvas = document.createElement( 'canvas' )
        canvas.setAttribute( 'width', opts.width )
        canvas.setAttribute( 'height', opts.height )
        this.ctx = canvas.getContext( '2d' )

        return this
    }

    generate( params ) {
        this.map = []

        let opts = Object.assign({
            startRadius: 0,
            startColor: new Color( 245, 245, 245 ),
            startPos: new Point( this.width / 2, this.height / 2 ),
            endRadius: this.width / 2 - 20,
            endColor: new Color( 0, 0, 0 ),
            endPos: new Point( this.width / 2, this.height / 2 )
        }, params || {} )

        // Draw gradient
        let grad = this.ctx.createRadialGradient( opts.startPos.x, opts.startPos.y, opts.startRadius, opts.endPos.x, opts.endPos.y, opts.endRadius )
        grad.addColorStop( 0, opts.startColor.toString() )
        grad.addColorStop( 1, opts.endColor.toString() )

        this.ctx.fillStyle = grad
        this.ctx.arc( opts.startPos.x, opts.startPos.y, opts.endRadius, 0, 2 * Math.PI, false )
        this.ctx.fill()

        // Populate map
        let image = this.ctx.getImageData( 0, 0, this.width, this.height )
        for ( let i = 0; i < image.data.length; i += 4 ) {
            this.map.push( image.data[ i ] / 0xff )
        }

        return this
    }

}
