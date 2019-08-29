import React from 'react'
import {smallAvatarFromUser, timeElapsed} from "../../utils/utils";
import {Link} from "react-router-dom";
import ReactMarkdown from "react-markdown";
import CodeRenderer from "../markdown/CodeRender";

function ReplyCell(props) {
    let reply = props.reply
    let user = reply.user
    let highlighted = (Number(props.highlightedFloor) === reply.floor) ? "reply-cell-highlighted" : ""

    let createdTime = timeElapsed(reply.created_time)

    return (
        <div className={`reply-cell ${highlighted}`} id={`floor-${reply.floor}`}>
            <div className="reply-info">
                <Link to={`/user/${user.id}`}>
                    {smallAvatarFromUser(user)}
                    <span className="reply-user-name">{user.username}</span>
                </Link>
                <span className="floor">{reply.floor}楼</span>
                <span className="reply-time">{createdTime}</span>
            </div>
            <div className="reply-content">
                <ReactMarkdown source={reply.content} renderers={
                    {
                        inlineCode: CodeRenderer,
                        code: CodeRenderer,
                    }}/>
            </div>
        </div>
    )
}

export default ReplyCell
