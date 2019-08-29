import React from 'react'

function AuthForm(props) {
    let onSubmit = props.onSubmit

    let username = props.username
    let password = props.password

    let onUsernameChange = props.onUsernameChange
    let onPasswordChange = props.onPasswordChange

    let formBody = props.formBody
    let submitBody = props.submitBody

    let title = props.title
    let submit = props.submit

    return (
        <div>
            <main className="login-form">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="card">
                                <div className="card-header">{title}</div>
                                <div className="card-body">

                                    {formBody}
                                    <form onSubmit={onSubmit}>
                                        <div className="form-group row">
                                            <label htmlFor="email_address"
                                                   className="col-md-4 col-form-label text-md-right">用户名</label>
                                            <div className="col-md-6">
                                                <input type="text" id="username" className="form-control"
                                                       name="username"
                                                       required autoFocus onChange={onUsernameChange}
                                                       value={username}/>
                                            </div>
                                        </div>

                                        <div className="form-group row">
                                            <label htmlFor="password"
                                                   className="col-md-4 col-form-label text-md-right">密码</label>
                                            <div className="col-md-6">
                                                <input type="password" id="password" className="form-control"
                                                       name="password" required onChange={onPasswordChange}
                                                       value={password}/>
                                            </div>
                                        </div>

                                        <div className="col-md-6 offset-md-4">
                                            <button type="submit" className="btn btn-primary">
                                                {submit}
                                            </button>
                                            {submitBody}
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

export default AuthForm
