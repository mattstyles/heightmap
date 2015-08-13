
import FastSimplex from 'fast-simplex-noise'

/**
 * @function
 * Creates a new simplex generator and holds it in closure
 */
export default function simplex( options ) {
    var fastSimplex = new FastSimplex( Object.assign({
        min: 0,
        max: 1,
        octaves: 4,
        frequency: .01,
        persistence: .5,
        amplitude: 1
    }, options ) )

    /**
     * Return a function for the Heightmap to invoke
     */
    return function( x, y ) {
        return fastSimplex.get2DNoise( x, y )
    }
}
