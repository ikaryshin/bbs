import React from 'react'
import {Link} from "react-router-dom"
import UserInfo from "./UserInfo"
import "../../css/sidebar.css"

function SideBar(props) {
    return (
        <div id="sidebar" className="float-right">
            <UserInfo user={props.user}/>

            <Link to="/new">
                <span className="span-info">发布话题</span>
            </Link>
        </div>
    )
}

export default SideBar