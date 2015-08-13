
/**
 * Heightmap class that handles procedurally generating an x,y point
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
     * Pushes a generator function and weight to the stack
     * @param params <Object>
     *   @param weight <Integer> the weighting to apply to this generator
     *   @param fn <Func> generator function that returns a value
     */
    addFunction( params ) {
        this.funcs.push( params )

        return this
    }

    /**
     * Iterates over a range of values
     * @param bounds <Rect> bounds to iterate over
     * @param cb <Func> function to call for each position
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
                cb.call( this, this.getValue( x, y ), x, y )
            }
        }

        return this
    }

    getValue = ( x, y ) => {
        // return this.map[ this.to1d( x, y ) ]
        if ( !this.funcs.length ) {
            throw new Error( 'heightmap does not have a generate function' )
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
