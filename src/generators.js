
import CONSTANTS from './constants'
import { euclidean, clamp } from './util'

export function radial( radius ) {
    return function generateRadial( x, y ) {
        // Adds radial gradient to center of chunk
        let i = x % CONSTANTS.WIDTH
        let j = y % CONSTANTS.WIDTH

        // let radius = CONSTANTS.WIDTH / 2
        let dist = euclidean({
            x: i,
            y: j
        }, {
            x: CONSTANTS.WIDTH / 2,
            y: CONSTANTS.HEIGHT / 2
        })

        // return 1 - dist / radius
        return clamp( 1 - dist / radius, 0, 1 )
    }
}
