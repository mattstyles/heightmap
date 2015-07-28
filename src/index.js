
import CONSTANTS from './constants'
// import Gui from './gui'
import HeightMap from './heightMap'
import MapRender from './mapRender'
import Simplex from './simplex'

import { Point, Vector2, max, min, euclidean, clamp } from './util'

const renderer = new MapRender()

console.log( 'generating simplex' )
let start = performance.now()
const simplex = new Simplex({
    min: 0,
    max: 1,
    persistence: .35,
    frequency: .005
}).generate({
    width: CONSTANTS.WIDTH,
    height: CONSTANTS.HEIGHT
})

let s = new Simplex({
    min: -1,
    max: 1,
    persistence: .5,
    frequency: .005
}).generate({
    width: CONSTANTS.WIDTH,
    height: CONSTANTS.HEIGHT
})
let hm = new HeightMap({
    width: CONSTANTS.WIDTH,
    height: CONSTANTS.HEIGHT,
    map: s.map
}).normalize()

const heightmap = new HeightMap({
    width: CONSTANTS.WIDTH,
    height: CONSTANTS.HEIGHT,
    map: simplex.map
})
    .mutate2d( function( x, y ) {
        // This radial gradient is expensive
        let radius = ( CONSTANTS.WIDTH / 2 ) - 20
        let dist = euclidean({
            x: x,
            y: y
        }, {
            x: CONSTANTS.WIDTH / 2,
            y: CONSTANTS.HEIGHT / 2
        })
        // return ( 1 - ( dist / radius ) ) * this.getValue( x, y )
        // let value = 1 - ( dist / radius )
        let value = dist / radius
        return value * this.getValue( x, y ) * Math.abs( hm.getValue( x, y ) )
        // return ( value + this.getValue( x, y ) + Math.abs( hm.getValue( x, y ) ) ) * 3
        // return value * this.getValue( x, y )
        // return ( value > .2 ? value : 0 ) * this.getValue( x, y )
        // return clamp( value, .2, 1 ) * this.getValue( x, y )
    })
    // .mutate2d( function( x, y ) {
    //     // The abs here with a -1...1 heightmap produces the ridges
    //     return Math.abs( hm.getValue( x, y ) ) * this.getValue( x, y )
    // })
    // .mutate2d( function( x, y ) {
    //     return 1 - this.getValue( x, y )
    // })
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
