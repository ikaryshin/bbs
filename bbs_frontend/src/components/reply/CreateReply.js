import React, {Component} from 'react'
import MarkdownEditor from "../markdown/MarkdownEditor";
import BasicAlert from "../common/BasicAlert";

class CreateReply extends Component {
    constructor(props) {
        super(props);
        this.api = props.api
        this.topicID = props.topicID
        this.state = {
            text: '',
            showAlert: false,
        }
    }

    onContentChange = (text) => {
        this.setState({
            text: text,
        })
    }

    onSubmit = (e) => {
        e.preventDefault()
        if (this.state.text.length <= 5) {
            this.toggleShow()
        } else {
            this.api.createReply(
                this.topicID,
                this.state.text,
                (r) => {
                    if (r.status) {
                        this.props.onUpdateReplies(r.reply)
                    }
                }
            )
        }
    }

    toggleShow = () => {
        this.setState((prev) => ({
            showAlert: !prev.showAlert,
        }))
    }

    render() {
        return (
            <div className="create-reply">
                <form className="form-horizontal" onSubmit={this.onSubmit}>
                    <MarkdownEditor text={this.state.text} onChange={this.onContentChange}/>
                    <div className="form-actions">
                        <input type="submit" className="btn-primary btn" value="发表评论"/>
                    </div>
                </form>
                <BasicAlert show={this.state.showAlert} toggleShow={this.toggleShow}
                            title="提交格式错误" body="评论内容必须大于五个字" />
            </div>
        )
    }
}

export default CreateReply