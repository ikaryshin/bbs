import React, {Component} from 'react'

class ChangeAvatar extends Component {
    constructor(props) {
        super(props)
        this.formData = new FormData()
        this.api = props.api
        this.fileIndex = 0

        this.state = {
            changed: false,
        }
    }

    onChange = (e) => {
        let image = this.refs.fileInput.files[this.fileIndex]
        this.formData.append("avatar", image)
    }

    onSubmit = (e) => {
        e.preventDefault()
        this.api.addAvatar(this.formData, (r) => {
            this.props.onChange()
            this.onShowAlert(r.status)
            this.formData.delete("avatar")
        })
    }

    onShowAlert = (status) => {
        if (status) {
            this.props.onShowAlert('成功', '更改用户头像成功')
        } else {
            this.props.onShowAlert('失败', '更改用户头像失败')
        }
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">更改用户头像</div>
                        <div className="card-body">
                            <form onSubmit={this.onSubmit}>
                                <div className="form-group row">
                                    <label htmlFor="email_address"
                                           className="col-md-4 col-form-label text-md-right">上传新头像</label>
                                    <div className="col-md-6">
                                        <input className="form-control-file" id="avatar" name="avatar"
                                                                       type="file" ref="fileInput" onInput={this.onChange}/>
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

export default ChangeAvatar