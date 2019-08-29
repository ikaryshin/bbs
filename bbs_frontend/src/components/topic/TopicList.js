import React from 'react'
import TopicCell from "./TopicCell";
import "../../css/topic.css"

function TopicList(props) {
    let topics = props.topics
    return (
        <div className="inner">
            <div className="topic-list">
                {
                    topics.map((topic) =>
                        <TopicCell key={topic.id}
                                   user={topic.user}
                                   views={topic.views}
                                   replies={topic.replies}
                                   lastReply={topic.lastReply}
                                   topic={topic}/>)
                }
            </div>
        </div>
    )
}

export default TopicList