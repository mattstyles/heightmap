
import CONSTANTS from './constants'
// import Gui from './gui'
import HeightMap from './heightMap'
import MapRender from './mapRender'
import Simplex from './simplex'
import GradMap from './gradientMap'

import { Point, Vector2, max, min, euclidean, clamp } from './util'

const renderer = new MapRender()

console.log( 'generating simplex' )
let start = performance.now()

// Base map
const simplex = new Simplex({
    min: 0,
    max: 1,
    persistence: .35,
    frequency: .005
}).generate({
    width: CONSTANTS.WIDTH,
    height: CONSTANTS.HEIGHT
})
let base = new HeightMap({
    width: CONSTANTS.WIDTH,
    height: CONSTANTS.HEIGHT,
    map: simplex.map
}).normalize()

// Perturb map
let s = new Simplex({
    min: -1,
    max: 1,
    persistence: .5,
    frequency: .005
}).generate({
    width: CONSTANTS.WIDTH,
    height: CONSTANTS.HEIGHT
})
let perturb = new HeightMap({
    width: CONSTANTS.WIDTH,
    height: CONSTANTS.HEIGHT,
    map: s.map
}).normalize()
let perturbRidges = new HeightMap({
    width: CONSTANTS.WIDTH,
    height: CONSTANTS.HEIGHT,
    map: s.map
}).mutate2d( function( x, y ) {
    return Math.abs( this.getValue( x, y ) )
})

// radial gradient map
// outside of the radius does not become 0 like a canvas drawn gradient,
// it keeps going either higher or lower ( 1 - value )
// let gradMap = new HeightMap({
//     width: CONSTANTS.WIDTH,
//     height: CONSTANTS.HEIGHT
// })
//     .mutate2d( function( x, y ) {
//         let radius = ( CONSTANTS.WIDTH / 2 ) - 40
//         let dist = euclidean({
//             x: x,
//             y: y
//         }, {
//             x: CONSTANTS.WIDTH / 2,
//             y: CONSTANTS.HEIGHT / 2
//         })
//         // return ( 1 - ( dist / radius ) ) * this.getValue( x, y )
//         let value = 1 - ( dist / radius )
//         // let value = dist / radius
//         return value
//     })

// canvas radial gradient map
// Check again but I think using canvas is actually slower than
// calcing all those euclideans in JS
let gradient = new GradMap({
    width: CONSTANTS.WIDTH,
    height: CONSTANTS.HEIGHT
})
    .generate({
        startRadius: 40,
        endRadius: CONSTANTS.WIDTH / 2
    })

let gradMap = new HeightMap({
    width: CONSTANTS.WIDTH,
    height: CONSTANTS.HEIGHT,
    map: gradient.map
})

// !! Big bug, stupid bug, passing map like this is passing by reference,
// should probably clone, in this example the mutations on the invertedGradMap
// mean that the gradMap is actually now inverted too
// let invertedGradMap = new HeightMap({
//     width: CONSTANTS.WIDTH,
//     height: CONSTANTS.HEIGHT,
//     map: gradMap.map
// })
//     .mutate2d( function( x, y ) {
//         return 1 - this.getValue( x, y )
//     })


const heightmap = new HeightMap({
    width: CONSTANTS.WIDTH,
    height: CONSTANTS.HEIGHT
})
    .multiPass([
        { weight: 2, heightmap: base },
        { weight: 4, heightmap: perturbRidges },
        { weight: 5, heightmap: gradMap }
    ])
    .normalize()
console.log( 'done', performance.now() - start )


function render() {
    console.log( 'rendering' )
    start = performance.now()
    renderer.clear()
    renderer.render( heightmap )
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
window.heightmap = heightmap
window.simplex = simplex
window.gradMap = gradMap
