
import dat from 'dat-gui'
import EventEmitter from 'events'

export default class Gui extends EventEmitter {
    constructor( props ) {
        super()

        this.props = props
        this.gui = new dat.GUI()

        this.gui.add( props, 'num', 0, 500 )
            .step( 10 )
            .onFinishChange( this.onChange )
        this.gui.add( props, 'sampleSize', 0, 8 )
            .step( 1 )
            .onFinishChange( this.onChange )
    }

    register( name, fn ) {
        let func = {}
        func[ name ] = fn
        this.gui.add( func, name )
    }

    onChange = () => {
        this.emit( 'change' )
    }

}
