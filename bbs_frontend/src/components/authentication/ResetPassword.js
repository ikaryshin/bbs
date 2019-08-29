import React, {Component} from 'react'

import BBSApi from "../../api/bbs_api";
import {onLogout, queryFromComponent, redirect, updateCurrentUser} from '../../utils/utils'
import NavBar from "../common/NavBar";
import BasicAlert from "../common/BasicAlert";

class ResetPassword extends Component {
    constructor(props) {
        super(props)
        this.api = new BBSApi()
        this.token = queryFromComponent(this).token
        this.state = {
            tokenValid: false,
            tokenChecked: false,
            password: '',
            currentUser: null,
            showAlert: false,
        }
    }

    checkToken = () => {
        this.api.checkToken(this.token, (r) => {
            let tokenValid = r.status
            this.setState({
                tokenValid: tokenValid,
                showAlert: !tokenValid,
                tokenChecked: true,
            })
        })
    }

    componentDidMount() {
        // this.api.user((r) => {
        //     this.setState({
        //         currentUser: r.user
        //     })
        // })
        updateCurrentUser(this)
        this.checkToken()
    }

    onResetPassword = (e) => {
        e.preventDefault()
        this.api.resetPasswordUpdate(this.token, this.state.password, (r) => {
            if (r.status) {
                redirect(this, '/login')
            }
        })
    }

    onChange = (e) => {
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
        let valid = this.state.tokenValid
        let checked = this.state.tokenChecked

        let form
        if (checked) {
            if (valid) {
                form = (
                    <div>
                        <main className="login-form">
                            <div className="container">
                                <div className="row justify-content-center">
                                    <div className="col-md-8">
                                        <div className="card">
                                            <div className="card-header">重置密码</div>
                                            <div className="card-body">
                                                <form onSubmit={this.onResetPassword}>
                                                    <div className="form-group row">
                                                        <label htmlFor="password"
                                                               className="col-md-4 col-form-label text-md-right">密码</label>
                                                        <div className="col-md-6">
                                                            <input type="password" id="password"
                                                                   className="form-control"
                                                                   name="password" required onChange={this.onChange}
                                                                   value={this.state.password}/>
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6 offset-md-4">
                                                        <button type="submit" className="btn btn-primary">
                                                            重置密码
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
            } else {
                form = (
                    <BasicAlert title="链接无效" body="请检查重置密码链接" toggleShow={this.toggleShow} show={this.state.showAlert}/>
                )
            }
        } else {
            form = ''
        }
        return (
            <div>
                <NavBar api={this.api} user={this.state.currentUser} onLogout={onLogout(this)}/>
                {form}
            </div>
        )
    }
}

export default ResetPassword
