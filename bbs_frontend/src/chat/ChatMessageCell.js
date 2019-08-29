import React from 'react'
import {avatarFromUser, log} from "../utils/utils";

function ChatMessageCell(props) {
    let message = props.message
    let other = props.other
    let user = props.user

    let cell
    if (message.sender_id !== user.id) {
        log(message.sender_id, user.id)
        // 不是自己发送的
        cell = (
            <div className="chat-message-cell chat-receive float-left">
                {avatarFromUser(other)}
                <div className="chat-message-cell-content">
                    <span>{message.content}</span>
                </div>
            </div>
        )
    } else {
        log(message.sender_id, user.id)
        cell = (
            <div className="chat-message-cell chat-send float-right">
                <div className="chat-message-cell-content">
                    <span>{message.content}</span>
                </div>
                {avatarFromUser(other)}
            </div>

        )
    }

    return (
        <div className="clearfix">
            {cell}
        </div>
    )
}

export default ChatMessageCell