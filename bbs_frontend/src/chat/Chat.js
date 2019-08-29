import React, {Component} from 'react'
import ChatMessageCell from "./ChatMessageCell";
import MessageInput from "./MessageInput";

class Chat extends Component {
    constructor(props) {
        super(props)

        this.state = {
            text: '',
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.scrollDownMessageContent()
    }

    sendMessage = () => {
        let room = this.props.contact.room_id

        let websocket = this.props.socket
        let data = {
            'room_id': room,
            'content': this.state.text,
            'token': localStorage.token,
        }
        websocket.emit('send', data)
    }

    scrollDownMessageContent = () => {
        let messageContent = this.refs.messageContent
        if (messageContent !== undefined) {
            messageContent.scrollTo(0, messageContent.scrollHeight)
        }
    }


    onChange = (e) => {
        this.setState({
            text: e.target.value
        })
    }

    render() {
        let chat
        let messages = this.props.messages
        if (messages !== null) {
            let user = this.props.user
            let other = this.props.contact.other

            chat = (
                <div className="message-chat">
                    <div className="message-other-user">
                        <span>{other.username}</span>
                    </div>
                    <div className="message-chat-content" ref="messageContent">
                        {
                            messages.map((message) => (
                                <ChatMessageCell key={message.id} message={message} other={other}
                                                 user={user}/>
                            ))
                        }
                    </div>

                    <MessageInput onChange={this.onChange} text={this.state.text} sendMessage={this.sendMessage}/>

                </div>
            )
        } else {
            chat = (
                <div className="message-chat">
                    <div className="message-other-user">
                    </div>
                    <div className="message-chat-content">
                    </div>
                </div>
            )
        }
        return chat
    }
}

export default Chat
