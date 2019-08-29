import React, {Component} from 'react'
import BBSApi from "../api/bbs_api";
import {
    avatarFromUser,
    connectWebSocket, isHttps,
    log,
    onLogout,
    queryFromComponent,
    redirect,
    updateCurrentUser
} from "../utils/utils";
import Chat from "./Chat";
import NavBar from "../components/common/NavBar";

import '../css/message.css'

class Message extends Component {
    constructor(props) {
        super(props)
        this.api = new BBSApi()
        this.sockets = []
        this.state = {
            contacts: [],
            chatID: -1,
            currentContact: null,
            currentSocket: null,
            currentMessages: null,
            reloadChat: false,
            user: null,
            currentUser: null,
        }
    }

    componentDidMount() {
        this.api.allContacts((r) => {
            if (r.status) {
                let {user, contacts} = r
                for (let contact of contacts) {
                    let s = connectWebSocket(contact.room_id, isHttps())
                    this.sockets.push(s)
                }
                this.setState({
                    contacts: contacts,
                    user: user,
                })
                let {chat} = queryFromComponent(this)
                if (chat !== undefined) {
                    let contacts = this.state.contacts
                    let chatID = contacts.findIndex((contact) => contact.room_id === chat)
                    this.changeChat(chatID)
                }
                updateCurrentUser(this)
            } else {
                redirect(this, '/login')
            }
        })

    }

    updateMessage = (message) => {
        this.setState((prevState) => ({
            currentMessages: prevState.currentMessages.concat(message)
        }))
    }

    changeChat = (chatID) => {
        let currentContact = this.state.contacts[chatID]
        let currentSocket = this.sockets[chatID]
        this.api.allMessages(currentContact.room_id, (r) => {
            if (r.status) {
                let currentMessages = r.messages
                this.setState({
                    currentContact,
                    currentSocket,
                    currentMessages,
                })
                let websocket = currentSocket
                if (!websocket.updateMessageEventBound) {
                    websocket.on('message', (data) => {
                        log('message ws', data)
                        this.updateMessage(data)
                    })
                    websocket.updateMessageEventBound = true
                }
            }
        })
    }

    onChangeChat = (e) => {
        let self = e.target.closest('li')
        let chatID = parseInt(self.id)
        this.changeChat(chatID)
    }

    render() {
        let activeContact = this.state.currentContact
        let activeSocket = this.state.currentSocket
        let activeMessages = this.state.currentMessages

        return (
            <div className="chat-page">
                <NavBar user={this.state.currentUser} onLogout={onLogout(this)}/>
                <div className="message clearfix">
                    <div className="header"><span>私信</span></div>
                    <ul className="contact-list">
                        {
                            this.state.contacts.map((contact, index) => (
                                <li key={contact.other.id} id={index} onClick={this.onChangeChat}>
                                    {avatarFromUser(contact.other)}
                                    <span>{contact.other.username}</span>
                                </li>
                            ))
                        }
                    </ul>
                    <Chat contact={activeContact} socket={activeSocket} api={this.api} user={this.state.user}
                          messages={activeMessages}/>
                </div>
            </div>
        )
    }
}

export default Message
