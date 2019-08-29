import React, {Component} from 'react'
import BBSApi from "../../api/bbs_api";
import {onLogout, redirect, updateCurrentUser} from "../../utils/utils";
import NavBar from "../common/NavBar";

class ResetPasswordForm extends Component {
    constructor(props) {
        super(props)
        this.api = new BBSApi()
        this.state = {
            success: false,
            username: '',
            currentUser: null,
        }
    }

    componentDidMount() {
        // this.api.user((r) => {
        //     this.setState({
        //         currentUser: r.user,
        //     })
        // })
        updateCurrentUser(this)
    }

    onResetPassword = (e) => {
        e.preventDefault()
        let {username} = this.state
        this.api.resetPassword(username, (r) => {
            if (r.status) {
                redirect(this, '/login')
            }
        })
    }

    onChange = (e) => {
        this.setState({
            username: e.target.value,
        })
    }

    render() {
        return (
            <div>
                <NavBar api={this.api} user={this.state.currentUser} onLogout={onLogout(this)}/>
                <main className="login-form">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-md-8">
                                <div className="card">
                                    <div className="card-header">重置密码</div>
                                    <div className="card-body">
                                        <form onSubmit={this.onResetPassword}>
                                            <div className="form-group row">
                                                <label htmlFor="email_address"
                                                       className="col-md-4 col-form-label text-md-right">用户名</label>
                                                <div className="col-md-6">
                                                    <input type="text" id="username" className="form-control"
                                                           name="username"
                                                           required autoFocus onChange={this.onChange}
                                                           value={this.state.username}/>
                                                </div>
                                            </div>

                                            <div className="col-md-6 offset-md-4">
                                                <button type="submit" className="btn btn-primary">
                                                    发送重置密码邮件
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        )
    }
}

export default ResetPasswordForm
