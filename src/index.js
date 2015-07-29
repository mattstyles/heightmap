
import random from 'lodash.random'

import CONSTANTS from './constants'
// import Gui from './gui'
import HeightMap from './heightMap'
import MapRender from './mapRender'
import Simplex from './simplex'

import { radial } from './generators'
import { Point, Vector2, max, min, euclidean, clamp } from './util'

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

console.log( 'generating simplex' )
let start = performance.now()

var simplex = new Simplex({
    min: 0,
    max: 1,
    octaves: 4,
    persistence: .3,
    frequency: .01
})
const base = new HeightMap()
    .addFunction({
        weight: 1,
        fn: simplex.getValue
    })

const baseMuted = new HeightMap()
    .addFunction({
        weight: 1,
        fn: base.getValue
    })
    .addFunction({
        weight: 1,
        fn: function( x, y ) {
            return .3
        }
    })

let perturb = new Simplex({
    min: -1,
    max: 1,
    persistence: .5,
    frequency: .005
})


const ridged = new HeightMap()
    .addFunction({
        weight: 2,
        fn: base.getValue
    })
    .addFunction({
        weight: 10,
        fn: function( x, y ) {
            // Adds the ridges
            return Math.abs( perturb.getValue( x, y ) )
        }
    })
    .addFunction({
        weight: 10,
        fn: radial( CONSTANTS.WIDTH / 2 )
    })


const right = new HeightMap()
    .addFunction({
        weight: 1,
        fn: function( x, y ) {
            // Now handle the seam
            function lerp( value, min, max ) {
                return min + value * ( max - min )
            }

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

console.log( 'done', performance.now() - start )


function render() {
    console.log( 'rendering' )
    start = performance.now()
    renderer.clear()
    renderer.render({
        heightmap: baseMuted
    })
    renderer2.render({
        heightmap: right,
        x: 512,
        y: 0
    })
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
