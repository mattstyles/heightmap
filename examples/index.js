
import random from 'lodash.random'
import Bezier from 'bezier-easing'

import CONSTANTS from './constants'
// import Gui from './gui'
import HeightMap from '../lib/heightmap.es6'
import MapRender from './mapRender'

import { radial } from './generators'
import { Point, Vector2, max, min, euclidean, clamp } from './util'

import { simplex } from '../lib/generators'

const renderer = new MapRender({
    style: {
        zIndex: 10
    }
})

const renderer2 = new MapRender({
    style: {
        left: CONSTANTS.WIDTH / window.devicePixelRatio + 'px',
        zIndex: 10
    }
})

function lerp( value, min, max ) {
    return min + value * ( max - min )
}



console.log( 'generating simplex' )
let start = performance.now()

// Simplex functions
const perturb = simplex({
    min: -1,
    max: 1,
    persistence: .5,
    frequency: .005
})

const sim = simplex({
    min: 0,
    max: 1,
    octaves: 4,
    persistence: 1 / Math.pow( 2, 4 ),
    frequency: 1 / Math.pow( 2, 8 ),
    amplitude: 1
})

const curve = new Bezier( .75, .1, .85, 1 )

// Heightmap function based on base simplex generator
const base = new HeightMap()
    .generator({
        weight: 1,
        // fn: simplex({
        //     min: 0,
        //     max: 1,
        //     octaves: 4,
        //     persistence: .3,
        //     frequency: .01
        // })
        // fn: simplex({
        //     min: 0,
        //     max: 1,
        //     octaves: 4,
        //     persistence: 1 / Math.pow( 2, 4 ),
        //     frequency: 1 / Math.pow( 2, 8 ),
        //     amplitude: 1
        // })
        fn: function( x, y ) {
            // Also uses a custom bezier curve to define edges in simplex
            return curve.get( sim( x, y ) )
        }
    })

// Maps x, y to 0-.3
// LEFT base chunk type
const baseMuted = new HeightMap()
    .generator({
        weight: 1,
        fn: ( x, y ) => base.getValue( x, y ) * .3
    })


// RIGHT base chunk type
const ridged = new HeightMap()
    .generator({
        weight: 1,
        fn: base.getValue
    })
    .generator({
        weight: 5,
        fn: function( x, y ) {
            // Adds the ridges
            return Math.abs( perturb( x, y ) )
        }
    })
    .generator({
        weight: 5,
        fn: radial( CONSTANTS.WIDTH / 2 )
    })


const right = new HeightMap()
    .generator({
        weight: 1,
        fn: function( x, y ) {
            // Now handle the seam
            let seamWidth = CONSTANTS.WIDTH / Math.pow( 2, 2 )
            let pow = 2
            let val = 0
            let i = x % CONSTANTS.WIDTH

            let mapValue = ridged.getValue( x, y )

            if ( i < seamWidth ) {
                // Heightmap is the chunk to the left in this example
                val = lerp(
                    Math.pow( i / seamWidth, pow ),
                    // i / seamWidth,
                    baseMuted.getValue( x, y ),      // Values from the left chunk
                    mapValue                    // mixed with values from this chunk
                )

                return val
            }

            return mapValue
        }
    })

const left = new HeightMap()
    .generator({
        weight: 1,
        fn: function( x, y ) {
            // Now handle the seam
            let seamWidth = CONSTANTS.WIDTH / Math.pow( 2, 2 )
            let pow = 2
            let val = 0
            let i = x % CONSTANTS.WIDTH

            let mapValue = baseMuted.getValue( x, y )

            if ( i > CONSTANTS.WIDTH - seamWidth ) {
                // Heightmap is the chunk to the left in this example
                val = lerp(
                    Math.pow( i / CONSTANTS.WIDTH - seamWidth, pow ),
                    // i / seamWidth,
                    ridged.getValue( x, y ),      // Values from the left chunk
                    mapValue                    // mixed with values from this chunk
                )

                return val
            }

            return mapValue
        }
    })


// @TODO sort out the seaming functions
// should also seam on both sides of the seam, i.e. left chunk permeates into
// right whilst right goes into left, effectively means that x=1 or right chunk
// is 50:50, not 100:0 as the current right HeightMap lerp creates




console.log( 'done', performance.now() - start )


function render() {
    console.log( 'rendering' )
    start = performance.now()
    renderer.clear()

    renderer.render({
        heightmap: base
    })

    // renderer2.render({
    //     heightmap: right,
    //     x: 512,
    //     y: 0
    // })
    console.log( 'done', performance.now() - start )
}


render()


window.Vector2 = Vector2
window.Point = Point
window.render = render
window.max = max
window.min = min
window.clamp = clamp
window.euclidean = euclidean

window.HeightMap = HeightMap

window.renderer = renderer

window.random = random
window.base = base
window.radial = radial
