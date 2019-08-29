import React, {Component} from 'react'

class ChangeSignature extends Component {
    constructor(props) {
        super(props)
        this.state = {
            signature: '',
            username: '',
            email: '',
            loaded: false,
        }
    }

    onSubmit = (e) => {
        e.preventDefault()
        let api = this.props.api
        let {signature, username, email} = this.state
        api.changeProfile(username, signature, email, (r) => {
            this.props.onChange()
            this.onShowAlert(r.status)

        })
    }

    onSignatureChange = (e) => {
        this.setState({
            signature: e.target.value,
        })
    }

    onUsernameChange = (e) => {
        this.setState({
            username: e.target.value,
        })
    }

    onEmailChange = (e) => {
        this.setState({
            email: e.target.value,
        })
    }


    onShowAlert = (status) => {
        if (status) {
            this.props.onShowAlert('成功', '更改用户信息成功')
        } else {
            this.props.onShowAlert('失败', '更改用户信息失败')
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!this.state.loaded) {
            this.setState({
                signature: this.props.user.signature,
                username: this.props.user.username,
                email: this.props.user.email,
                loaded: true,
            })
        }
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">更改个人信息</div>
                        <div className="card-body">
                            <form onSubmit={this.onSubmit}>
                                <div className="form-group row">
                                    <label className="col-md-4 col-form-label text-md-right">用户名</label>
                                    <div className="col-md-6">
                                        <input type="text" className="form-control"
                                               required onChange={this.onUsernameChange}
                                               value={this.state.username}/>
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label className="col-md-4 col-form-label text-md-right">新签名</label>
                                    <div className="col-md-6">
                                        <textarea className="form-control"
                                                  required onChange={this.onSignatureChange}
                                                  value={this.state.signature}/>
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label className="col-md-4 col-form-label text-md-right">新电子邮件</label>
                                    <div className="col-md-6">
                                        <input type="email" className="form-control"
                                               required onChange={this.onEmailChange}
                                               value={this.state.email}/>
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

export default ChangeSignature