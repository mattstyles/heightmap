
import FastSimplex from 'fast-simplex-noise'

/**
 * Simplex wrapper
 */
export default class Simplex {
    /**
     * @constructs
     * @param params <Object> passed to simplex generator
     */
    constructor( params ) {
        this.simplex = new FastSimplex( Object.assign({
            min: 0,
            max: 1,
            octaves: 4,
            frequency: .01,
            persistence: .5,
            amplitude: 1
        }, params || {} ) )

        return this
    }

    /**
     * Gets the value at x,y world coords
     * @param x <Integer> world coord
     * @param y <Integer> world coord
     */
    getValue = ( x, y ) => {
        return this.simplex.get2DNoise( x, y )
    }

}
