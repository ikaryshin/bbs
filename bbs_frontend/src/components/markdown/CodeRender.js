import React, {Component} from 'react';
import Lowlight from 'react-lowlight';
import js from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import 'highlight.js/styles/github.css'

Lowlight.registerLanguage('js', js);
Lowlight.registerLanguage('js', python);

class CodeBlock extends Component {
    constructor(props) {
        super(props)
        this.literal = this.props.literal || ''
    }

    render() {
        return (
                <Lowlight
                    language='js'
                    // value={this.literal}
                    value={this.props.value}
                    inline={this.props.inline}
                />
        )
    }
}

export default CodeBlock