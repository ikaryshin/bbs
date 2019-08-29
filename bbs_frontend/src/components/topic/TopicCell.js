import React from 'react'
import {imageSrcFromName, timeElapsed, userLinkFromID} from "../../utils/utils";
import {Link} from "react-router-dom";

function TopicCell(props) {
    let {username, image, id} = props.user

    let replies = props.replies
    let views = props.views

    let lastReply = props.lastReply

    let topicTitle = props.topic.title
    let topicID = props.topic.id

    let lastReplyDiv
    if (lastReply !== null) {
        let sinceLastReply = timeElapsed(props.lastReply.created_time)
        lastReplyDiv = (
            <Link className="float-right last-reply"
                to={`/topic/${topicID}?floor=${lastReply.floor}`}>
                <img className="user-small-avatar float-left" src={imageSrcFromName(lastReply.user.image)} alt="user small avatar"/>
                <span className="since-last-reply">{sinceLastReply}</span>
            </Link>
        )
    } else {
        lastReplyDiv = ''
    }

    return (
        <div className="panel topic-cell xclearfix">

            <a className="float-left" href={userLinkFromID(id)}>
                <img className="user-avatar" src={imageSrcFromName(image)} title={username} alt="user avatar"/>
            </a>

            {lastReplyDiv}

            <div className="topic-title-container">
                <Link className="topic-title" to={`/topic/${topicID}`}
                      title={topicTitle}>
                        {topicTitle}
                </Link>
            </div>

            <span className="reply-data">
                <span className="reply-count" title="回复数">{replies}</span>
                <span className="count-seperator">/</span>
                <span className="view-count" title="点击数">{views}</span>
            </span>

        </div>
)
}

export default TopicCell

