import React, {Component} from 'react'
import ReplyList from "../reply/ReplyList"
import CreateReply from "../reply/CreateReply"
import TopicContent from "./TopicContent";
import BBSApi from "../../api/bbs_api";
import NavBar from "../common/NavBar";

import '../../css/topic-view.css'
import {
    isLogged,
    onLogout,
    queryFromComponent,
    updateCurrentUser
} from "../../utils/utils";

class TopicView extends Component {
    constructor(props) {
        super(props)
        this.api = new BBSApi()
        this.id = this.props.match.params.id
        this.floor = queryFromComponent(this).floor
        this.state = {
            user: null,
            topic: null,
            replies: null,
            toScroll: false,
            loaded: false,
            currentUser: null,
            logged: false,
            highlightedFloor: -1,
        }

    }

    scrollToAnchor = () => {
        let anchorId = this.floor
        if (anchorId !== '') {   // 找到锚点 id
            let anchorElement = document.querySelector(`#floor-${anchorId}`)
            if (anchorElement !== null) {
                window.scrollTo(0, anchorElement.offsetTop)
                this.setState({
                    highlightedFloor: anchorId,
                })
            }
        }
    }

    componentDidMount() {
        this.api.topicDetail(this.id, (r) => {
            this.setState({
                user: r.topic.user,
                topic: r.topic,
                replies: r.topic.replies,
                toScroll: true,
                loaded: true,
            })
        })

        updateCurrentUser(this)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.toScroll) {
            this.scrollToAnchor()
            this.setState({
                toScroll: false,
            })
        }
    }

    updateReplyList = (reply) => {
        this.setState({
            replies: this.state.topic.replies.concat(reply),
        })
    }

    render() {
        let topicContainer
        if (this.state.loaded) {
            let createReply
            if (isLogged(this.state.currentUser)) {
                createReply = (
                    <CreateReply api={this.api} topicID={this.id} onUpdateReplies={this.updateReplyList}/>
                )
            } else {
                createReply = ''
            }

            topicContainer = (
                <div className="topic-container">
                    <TopicContent topic={this.state.topic} user={this.state.user}/>
                    <ReplyList replies={this.state.replies} highlightedFloor={this.state.highlightedFloor}/>
                    {createReply}
                </div>
            )
        } else {
            topicContainer = (
                <div className="topic-container">
                </div>
            )
        }

        return (
            <div id="container">
                <NavBar user={this.state.currentUser} onLogout={onLogout(this)}/>
                {topicContainer}
            </div>
        )
    }
}

export default TopicView