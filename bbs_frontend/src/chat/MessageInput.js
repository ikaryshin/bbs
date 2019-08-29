import React from 'react'

function MessageInput(props) {
    let onChange = props.onChange
    let text = props.text
    let sendMessage = props.sendMessage

    return (
        <div className="message-chat-input">
            <input className="message-chat-input-content" type="text" onChange={onChange}
                   value={text}/>
            <input className="message-chat-input-submit btn btn-primary" type='button' value='送出訊息'
                   onClick={sendMessage}/>
        </div>
    )
}

export default MessageInput