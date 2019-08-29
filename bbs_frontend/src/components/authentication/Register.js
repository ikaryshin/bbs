import React, {Component} from 'react'
import {onLogout, redirect, updateCurrentUser} from "../../utils/utils";
import BBSApi from "../../api/bbs_api";
import NavBar from "../common/NavBar";
import AuthForm from "./AuthForm";
import BasicAlert from "../common/BasicAlert";

class Register extends Component {
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

    onRegister = (e) => {
        e.preventDefault()
        let {username, password} = this.state
        this.api.register(username, password, (r) => {
            if (r.status) {
                redirect(this, '/login')
            } else {
                this.setState({
                    showAlert: true,
                })
            }
        })
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
        return (
            <div>
                <NavBar api={this.api} user={this.state.currentUser} onLogout={onLogout(this)}/>
                <AuthForm onSubmit={this.onRegister} username={this.state.username} password={this.state.password}
                          submit="注册" title="注册"
                          onUsernameChange={this.onUsernameChange} onPasswordChange={this.onPasswordChange}/>
                <BasicAlert title="注册失败" body="请检查用户名和密码" toggleShow={this.toggleShow} show={this.state.showAlert}/>
            </div>
        )
    }
}

export default Register
