
import FastSimplex from 'fast-simplex-noise'

export default class Simplex {
    constructor( params ) {
        this.map = []

        this.simplex = new FastSimplex( Object.assign({
            min: 0,
            max: 1,
            octaves: 5,
            frequency: .01,
            persistence: .4,
            amplitude: 1
        }, params || {} ) )

        return this
    }

    generate( params ) {
        this.map = []
        for ( let y = 0; y < params.width; y++ ) {
            for ( let x = 0; x < params.height; x++ ) {
                this.map.push( this.simplex.get2DNoise( x, y ) )
            }
        }

        return this
    }

    getValue = ( x, y ) => {
        return this.simplex.get2DNoise( x, y )
    }

}
