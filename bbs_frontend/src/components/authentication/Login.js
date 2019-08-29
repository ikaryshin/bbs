import React, {Component} from 'react'
import {redirect, onLogout, updateCurrentUser, updateUserCache} from "../../utils/utils";
import BBSApi from "../../api/bbs_api";
import {Link} from "react-router-dom";
import NavBar from "../common/NavBar";
import AuthForm from "./AuthForm";
import BasicAlert from "../common/BasicAlert";

class Login extends Component {
    constructor(props) {
        super(props)
        this.api = new BBSApi()
        this.state = {
            username: '',
            password: '',
            showAlert: false,
            currentUser: null,
        }
    }

    componentDidMount() {
        updateCurrentUser(this)
    }

    onLogin = (e) => {
        e.preventDefault()
        let {username, password} = this.state
        this.api.login(username, password, (r) => {
            if (r.status) {
                updateUserCache(r.token)
                redirect(this, '/')
            } else {
                this.setState({
                    showAlert: true,
                })
            }
        })
    }

    loginUser = (userID) => {
        return () => {
            let users = [
                {
                    username: 'abc',
                    password: '123',
                },
                {
                    username: 'test',
                    password: '123',
                }
            ]
            let user = users[userID - 1]

            this.api.login(user.username, user.password, (r) => {
                if (r.status) {
                    updateUserCache(r.token)
                    redirect(this, '/')
                } else {
                    this.setState({
                        showAlert: true,
                    })
                }
            })
        }
    }

    onUsernameChange = (e) => {
        this.setState({
            username: e.target.value,
        })
    }

    onPasswordChange = (e) => {
        this.setState({
            password: e.target.value,
        })
    }

    toggleShow = () => {
        this.setState((prev) => ({
            showAlert: !prev.showAlert,
        }))
    }

    render() {
        let formBody = (
            <div>
                <span><Link to='/user/1'>用户1</Link> 用户名: abc 密码: 123</span>
                <button className="btn btn-primary" onClick={this.loginUser(1)}>以用户 1 登录
                </button>
                <br/>
                <span><Link to='/user/2'>用户2</Link> 用户名: test 密码: 123</span>
                <button className="btn btn-primary" onClick={this.loginUser(2)}>以用户 2 登录
                </button>
            </div>
        )

        let submitBody = (
            <Link to="/reset/view" className="btn btn-link">
                忘记密码？
            </Link>
        )

        return (
            <div>
                <NavBar api={this.api} user={this.state.currentUser} onLogout={onLogout(this)}/>
                <AuthForm onSubmit={this.onLogin} username={this.state.username} password={this.state.password}
                          formBody={formBody} submitBody={submitBody}
                          submit="登录" title="登录"
                          onUsernameChange={this.onUsernameChange} onPasswordChange={this.onPasswordChange}/>
                <BasicAlert title="登录失败" body="用户名或密码错误" toggleShow={this.toggleShow} show={this.state.showAlert}/>
            </div>
        )
    }
}

export default Login
