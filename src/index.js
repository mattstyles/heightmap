
/**
 * Heightmap class that handles procedurally generating an x,y point
 * @class
 */
export default class HeightMap {
    /**
     * @constructs
     */
    constructor() {
        this.funcs = []

        return this
    }

    /**
     * Pushes a generator descriptor to the stack
     * A descriptor requires a weight and a function that takes an <x.y> point
     * and returns a value between 0 and 1
     * @param params <Object> generator descriptor
     *   @param weight <Integer> the weighting to apply to this generator
     *   @param fn <Func> generator function that returns a value
     */
    generator( params ) {
        if ( !params ) {
            throw new Error( 'Heightmap::generator descriptor required' )
        }

        if ( !params.weight || !params.fn ) {
            throw new Error( 'Heightmap::generator invalid descriptor' )
        }

        this.funcs.push( params )

        return this
    }

    /**
     * Iterates over a range of values
     * @param bounds <Rect> bounds to iterate over <x1.x2.y1.y2>
     * @param cb <Func> function to call for each position
     *   callback gets called with the value at a position and the position as <x.y>
     */
    iterate( bounds, cb ) {
        if ( !bounds ) {
            throw new Error( 'Heightmap::iterate requries a bounding area' )
        }

        if ( !cb ) {
            throw new Error( 'Heightmap::iterate requires an iterator function' )
        }

        for ( let y = bounds.y1; y < bounds.y2; y++ ) {
            for ( let x = bounds.x1; x < bounds.x2; x++ ) {
                cb.call( this, this.getValue( x, y ), {
                    x: x,
                    y: y
                })
            }
        }

        return this
    }

    /**
     * Returns a value from an x, y location point
     * @param x <Integer>
     * @param y <Integer>
     * @returns <Float> 0...1
     */
    getValue = ( x, y ) => {
        if ( !this.funcs.length ) {
            throw new Error( 'Heightmap does not have a generator function' )
        }

        let value = 0
        let totalWeight = 0
        this.funcs.forEach( pass => {
            totalWeight += pass.weight
            value += pass.weight * pass.fn( x, y )
        })

        // @TODO cache it
        return value / totalWeight
    }

}
