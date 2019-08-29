import React, {Component} from 'react'
import TopicList from "../topic/TopicList";
import BBSApi from "../../api/bbs_api";
import {bigAvatarFromUser, onLogout, paramsFromComponent, redirect, timeElapsed} from "../../utils/utils";
import {Link} from "react-router-dom";
import NavBar from "../common/NavBar";

import '../../css/profile.css'

class Profile extends Component {
    constructor(props) {
        super(props)
        this.api = new BBSApi()
        this.id = paramsFromComponent(this).id
        this.state = {
            validUser: false,
            user: {},
            currentUser: null,
            replied: [],
            created: [],
        }
    }

    currentUser = () => {
        this.api.user((r) => {
            this.setState({
                currentUser: r.user,
            })
        })
    }

    componentDidMount() {
        if (this.id !== undefined) {
            this.api.user((rUser) => {
                this.api.userByID(this.id, (r) => {
                    this.setState({
                        validUser: true,
                        user: r.user,
                        replied: r.replied,
                        created: r.created,
                        currentUser: rUser.user,
                    })
                })
            })
        } else {
            if (!this.state.validUser) {
                this.api.user((rUser) => {
                    this.api.profile((r) => {
                        if (r.status) {
                            this.setState({
                                user: r.user,
                                replied: r.replied,
                                created: r.created,
                                currentUser: rUser.user,
                            })
                        } else {
                            redirect(this, '/login')
                        }
                    })
                })
            }
        }
    }

    onChat = (e) => {
        e.preventDefault()
        // let id = this.id === undefined ? this.id :
        this.api.newChat(this.id, (r) => {
            if (r.status) {
                redirect(this, `/chat?chat=${r.room}`)
            } else {
                redirect(this, '/login')
            }
        })
    }

    render() {
        let username = this.state.user.username
        let createdTime = timeElapsed(this.state.user.created_time)

        let userSettingButton = ''
        let chatButton = ''
        if (this.state.currentUser && this.state.user) {
            if (this.state.currentUser.id !== this.state.user.id) {
                chatButton = (
                    <button onClick={this.onChat} className="link-button">私信TA</button>
                )
            } else {
                userSettingButton = (
                    <Link to="/setting" className="profile-setting">用户设置</Link>
                )
            }
        }

        return (
            <div id="container">
                <NavBar api={this.api} user={this.state.currentUser} onLogout={onLogout(this)}/>
                <div id="main">

                    <div id="content" className="profile-container">
                        <div className="panel">
                            <div className="header">
                                <span>用户信息</span>
                            </div>
                            <div className="profile inner">
                                <div className="profile-avatar-username-container">
                                    {bigAvatarFromUser(this.state.user)}
                                    <span className="profile-username">{username}</span>
                                </div>
                                {userSettingButton}
                                {chatButton}
                                <br/>
                                <span className="profile-register-time">注册时间 {createdTime}</span>
                            </div>
                        </div>

                        <div className="panel">
                            <div className="header">
                                <span>最近创建的话题</span>
                            </div>

                            <TopicList topics={this.state.created}/>

                        </div>

                        <div className="panel">
                            <div className="header">
                                <span>最近参与的话题</span>
                            </div>

                            <TopicList topics={this.state.replied}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Profile