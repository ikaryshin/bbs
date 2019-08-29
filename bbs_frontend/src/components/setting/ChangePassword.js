import React, {Component} from 'react'

class ChangePassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            oldPassword: '',
            newPassword: '',
        }
    }

    onSubmit = (e) => {
        e.preventDefault()
        let api = this.props.api
        let {oldPassword, newPassword} = this.state
        api.changePassword(oldPassword, newPassword, (r) => {
            this.onShowAlert(r.status)
            this.setState({
                oldPassword: '',
                newPassword: '',
            })
        })
        this.props.onChange()
    }

    onOldPasswordChange = (e) => {
        this.setState({
            oldPassword: e.target.value,
        })
    }

    onNewPasswordChange = (e) => {
        this.setState({
            newPassword: e.target.value,
        })
    }

    onShowAlert = (status) => {
        if (status) {
            this.props.onShowAlert('成功', '更改密码成功')
        } else {
            this.props.onShowAlert('失败', '更改密码失败')
        }
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">更改密码</div>
                        <div className="card-body">
                            <form onSubmit={this.onSubmit}>
                                <div className="form-group row">
                                    <label className="col-md-4 col-form-label text-md-right">当前密码</label>
                                    <div className="col-md-6">
                                        <input type="password" className="form-control"
                                               required onChange={this.onOldPasswordChange}
                                               value={this.state.oldPassword}/>
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label className="col-md-4 col-form-label text-md-right">新密码</label>
                                    <div className="col-md-6">
                                        <input type="password" className="form-control"
                                               required onChange={this.onNewPasswordChange}
                                               value={this.state.newPassword}/>
                                    </div>
                                </div>

                                <div className="col-md-6 offset-md-4">
                                    <button type="submit" className="btn btn-primary">
                                        确认更改
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ChangePassword