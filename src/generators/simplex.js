
import FastSimplex from 'fast-simplex-noise'

export default function simplex( options ) {
    var opts = Object.assign({
        params: {}
    }, options )

    var fastSimplex = new FastSimplex( Object.assign({
        min: 0,
        max: 1,
        octaves: 4,
        frequency: .01,
        persistence: .5,
        amplitude: 1
    }, opts.params ) )

    return fastSimplex.get2DNoise
}
