import React, {Component} from 'react'
import ReactMde from "react-mde"
import 'react-mde/lib/styles/css/react-mde-all.css'
import ReactMarkdown from "react-markdown"
import CodeRenderer from './CodeRender'


class MarkdownEditor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            text: '',
            tab: 'write',
        }
    }

    changeTab = (tab) => {
        this.setState({
            tab: tab,
        })
    }

    render() {
        return (
            <ReactMde selectedTab={this.state.tab}
                      onTabChange={this.changeTab}
                      value={this.props.text}
                      onChange={this.props.onChange}
                      generateMarkdownPreview={(md) => Promise.resolve(<ReactMarkdown source={md} renderers={
                          {
                              inlineCode: CodeRenderer,
                              code: CodeRenderer,
                          }
                      }/>)}
            />
        )
    }
}

export default MarkdownEditor