import React from 'react'
import {Link} from "react-router-dom";
import {bigAvatarFromUser, userLinkFromID} from "../../utils/utils";

import "../../css/user-info.css"

function UserInfo(props) {
    if (props.user === null) {
        return (
            <div id="user-info" className="panel">
                <div className="header">
                    <span>个人信息</span>
                </div>
            </div>
        )
    } else {
        let {username, id, signature} = props.user
        return (
            <div id="user-info" className="panel">
                <div className="header">
                    <span>个人信息</span>
                </div>
                <div className="inner user-card">
                    <a href={userLinkFromID(id)}>
                        {bigAvatarFromUser(props.user)}
                    </a>
                    <span className="user-name">
                    <Link className="dark" to="/profile">{username}</Link>
                </span>
                    <span className="signature">
                    {signature}
                </span>
                </div>
            </div>
        )
    }
}

export default UserInfo