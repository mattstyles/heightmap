import CONSTANTS from './constants'

export function to1d( x, y ) {
    return x + ( y * CONSTANTS.WIDTH )
}

export function lerp( value, min, max ) {
    return min + value * ( max - min )
}

export function max( map ) {
    // return map.reduce( ( prev, curr ) => curr > prev ? curr : prev, 0 )
    let val = 0
    for ( var i = 0; i < map.length; i++ ) {
        val = map[ i ] > val ? map[ i ] : val
    }
    return val
}

export function min( map ) {
    //return map.reduce( ( prev, curr ) => curr < prev ? curr : prev, 0 )
    let val = 0
    for ( var i = 0; i < map.length; i++ ) {
        val = map[ i ] < val ? map[ i ] : val
    }
    return val
}

export function clamp( value, min, max ) {
    return value < min
        ? min
        : value > max
            ? max
            : value
}



// Squaring and rooting is fairly expensive
export function euclidean( pt1, pt2 ) {
    return Math.sqrt( Math.pow( pt1.x - pt2.x, 2 ) + Math.pow( pt1.y - pt2.y, 2 ) )
}

// Quick, struggles with diagonals, will give false results
export function manhattan( pt1, pt2 ) {
    return Math.abs( pt1.x - pt2.x ) + Math.abs( pt1.y - pt2.y )
}


export class Point {
    constructor( x, y ) {
        this.x = x
        this.y = y
    }
}

export class Rect {
    constructor( x1, y1, x2, y2 ) {
        this.x1 = x1
        this.y1 = y1
        this.x2 = x2
        this.y2 = y2
    }
}

export class Vector2 {
    constructor( src, dest ) {
        this.x = dest.pos.x - src.pos.x
        this.y = dest.pos.y - src.pos.y
    }

    normalize() {
        let r = Math.max( this.x, this.y )
        this.x *= r
        this.y *= r
    }

    lerp( value ) {
        return new Point( this.x * value, this.y * value )
    }

    magnitude() {
        return Math.sqrt( Math.pow( this.x, 2 ) + Math.pow( this.y, 2 ) )
    }
}

export class Color {
    constructor( r, g, b, a ) {
        this.color = [ r, g, b ]

        if ( a ) {
            this.color.push( a )
        }
    }

    toString() {
        return 'rgb' +
            ( this.color[ 3 ] ? 'a' : '' ) +
            '(' + this.color.join( ',' ) + ')'
    }
}
