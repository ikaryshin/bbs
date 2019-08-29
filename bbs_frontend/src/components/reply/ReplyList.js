import React from 'react'
import ReplyCell from "./ReplyCell";

function ReplyList(props) {
    let replies = props.replies
    let highlightedFloor = props.highlightedFloor
    return (
        <div className="reply-list-container">
            <div className="header">
                <span>回复</span>
            </div>
            {
                replies.map((reply) => <ReplyCell total={replies.length} index={reply.floor} key={reply.id}
                                                         reply={reply} highlightedFloor={highlightedFloor}/>)
            }
        </div>
    )
}

export default ReplyList
