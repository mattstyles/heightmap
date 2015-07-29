
import { Point } from './util'

export default class HeightMap {
    constructor( options ) {
        let opts = Object.assign({
            width: 64,
            height: 64
        }, options || {} )
        this.map = opts.map || []
        this.width = opts.width
        this.height = opts.height

        return this
    }

    to1d( x, y ) {
        return x + y * this.width
    }

    to2d( i ) {
        return new Point( i % this.width, ~~( i / this.width ) )
    }

    /**
     * Passes the value of the cells to the callback
     */
    iterate2d( cb ) {
        for ( let y = 0; y < this.width; y++ ) {
            for ( let x = 0; x < this.height; x++ ) {
                cb.call( this, this.map[ this.to1d( x, y ) ], x, y )
            }
        }

        return this
    }

    /**
     * Maps the map array, additionally passing x and y to the callback
     */
    mutate2d( cb ) {
        for ( let y = 0; y < this.width; y++ ) {
            for ( let x = 0; x < this.height; x++ ) {
                this.map[ this.to1d( x, y ) ] = cb.call( this, x, y )
            }
        }

        return this
    }

    /**
     * Simple array fill
     */
    fill( value ) {
        for( let i = 0; i < this.width * this.height; i++ ) {
            this.map[ i ] = value
        }

        return this
    }

    /**
     * Converts to 0...1 range
     * Clamps any negatives to 0
     */
    normalize() {
        // Get min and max
        let min = 1e8
        let max = 0
        this.map.forEach( cell => {
            min = cell < min ? cell : min
            max = cell > max ? cell : max
        })

        min = min < 0 ? 0 : min

        let range = max - min

        this.map = this.map.map( cell => ( cell - min ) / range )

        return this
    }

    /**
     * Converts to 0..1 from 0...255
     */
    neutralize() {
        this.map = this.map.map( cell => cell / 0xff )

        return this
    }

    /**
     * Expands granularity of the map
     * If map is 64x64 and you expand by 2 then resultant map will
     * be 128x128
     */
    expand( val ) {
        let newMap = []
        for ( let y = 0; y < this.height; y++ ) {
            for ( let count = 0; count < val; count++ ) {
                for ( let x = 0; x < this.width; x++ ) {
                    let cell = this.map[ this.to1d( x, y ) ]
                    for ( let c = 0; c < val; c++ ) {
                        newMap.push( cell )
                    }
                }
            }
        }

        this.map = newMap
        this.width *= val
        this.height *= val

        return this
    }

    /**
     * Creates a new map based on the passes
     * @param passes <Array>
     *   heightmap <HeightMap>
     *   weight <Number>
     */
    multiPass( passes ) {
        let totalWeights = 0

        // Quick check sizes
        // Add up max weights at the same time
        passes.forEach( pass => {
            totalWeights += pass.weight

            if ( pass.heightmap.width !== this.width || pass.heightmap.height !== this.width ) {
                throw new Error( 'HeightMap::multiPass map sizes do not match' )
            }
        })

        function getCell( i ) {
            let cell = 0
            for ( let p = 0; p < passes.length; p++ ) {
                cell += passes[ p ].heightmap.map[ i ] * passes[ p ].weight
            }
            return cell / totalWeights
        }

        // Iterate over each cell
        for ( let i = 0; i < passes[ 0 ].heightmap.map.length; i++ ) {
            this.map[ i ] = getCell( i )
        }

        return this
    }

    getValue( x, y ) {
        return this.map[ this.to1d( x, y ) ]
    }

    setValue( x, y, value ) {
        this.map[ this.to1d( x, y ) ] = value
    }

    getRegion( x1, y1, x2, y2 ) {
        let region = []

        for ( let y = y1; y <= y2; y++ ) {
            for ( let x = x1; x <= x2; x++ ) {
                region.push( this.map[ this.to1d( x, y ) ] )
            }
        }

        return region
    }

    debug() {
        for ( let y = 0; y < this.height; y++ ) {
            let row = []
            for ( let x = 0; x < this.width; x++ ) {
                row.push( this.map[ this.to1d( x, y ) ] )
            }
            console.log( row.join( ' ' ) )
        }
    }

}
