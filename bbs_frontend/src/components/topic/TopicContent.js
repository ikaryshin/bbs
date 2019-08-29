import React, {Component} from 'react'
import ReactMarkdown from "react-markdown";
import CodeRenderer from "../markdown/CodeRender";
import {timeElapsed} from "../../utils/utils";
import {Link} from "react-router-dom";

class TopicContent extends Component {
    render() {
        let topic = this.props.topic
        let content = topic.content
        let title = topic.title
        let board = topic.board
        let createdTime = timeElapsed(topic.created_time)
        let views = topic.views

        let user = this.props.user
        let username = user.username
        let userID = user.id

        return (
            <div className="topic-content">
                <div className='topic-header'>
                    <span className="topic-full-title">{title}</span>
                    <div className="topic-detail">
                        <span> 发布于 {createdTime} </span>
                        <span>作者 <Link to={`/user/${userID}`}>{username}</Link></span>
                        <span>{views} 次浏览</span>
                        <span> 来自 {board}</span>
                    </div>
                </div>
                <hr/>
                <div className="topic-text">
                    <ReactMarkdown source={content} renderers={
                        {
                            inlineCode: CodeRenderer,
                            code: CodeRenderer,
                        }}/>
                </div>
            </div>
        )
    }
}

export default TopicContent