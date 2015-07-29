
import random from 'lodash.random'

import CONSTANTS from './constants'
// import Gui from './gui'
import HeightMap from './heightMap'
import MapRender from './mapRender'
import Simplex from './simplex'
import GradMap from './gradientMap'


import { Point, Vector2, max, min, euclidean, clamp } from './util'

const renderer = new MapRender({
    style: {
        zIndex: 10
    }
})

const renderer2 = new MapRender({
    style: {
        left: CONSTANTS.WIDTH + 'px',
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
    .addFunction( 1, simplex.getValue )
    .addFunction( 1, function( x, y ) {
        return .3
    })

let perturb = new Simplex({
    min: -1,
    max: 1,
    persistence: .5,
    frequency: .005
})
const ridged = new HeightMap()
    .addFunction( 2, base.getValue )
    .addFunction( 10, function( x, y ) {
        // Adds the ridges
        return Math.abs( perturb.getValue( x, y ) )
    })
    .addFunction( 10, function( x, y ) {
        // Adds radial gradient to center of chunk
        let i = x % CONSTANTS.WIDTH
        let j = y % CONSTANTS.WIDTH

        let radius = CONSTANTS.WIDTH / 2
        let dist = euclidean({
            x: i,
            y: j
        }, {
            x: CONSTANTS.WIDTH / 2,
            y: CONSTANTS.HEIGHT / 2
        })

        // return 1 - dist / radius
        return clamp( 1 - dist / radius, 0, 1 )
    })




const right = new HeightMap()
    .addFunction( 1, function( x, y ) {
        // Now handle the seam
        function lerp( value, min, max ) {
            return min + value * ( max - min )
        }

        let seamWidth = CONSTANTS.WIDTH / Math.pow( 2, 2 )
        // let pow = 2
        let val = 0
        let i = x % CONSTANTS.WIDTH

        let mapValue = ridged.getValue( x, y )

        if ( i < seamWidth ) {
            // Heightmap is the chunk to the left in this example
            val = lerp(
                // Math.pow( i / seamWidth, pow ),
                i / seamWidth,
                base.getValue( x, y ),      // Values from the left chunk
                mapValue                    // mixed with values from this chunk
            )

            return val
        }

        return mapValue
    })

console.log( 'done', performance.now() - start )


function render() {
    console.log( 'rendering' )
    start = performance.now()
    renderer.clear()
    renderer.render({
        heightmap: base
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
