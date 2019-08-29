import React, {Component} from 'react'
import ChangePassword from "./ChangePassword"
import BBSApi from "../../api/bbs_api"
import ChangeSignature from "./ChangeSignature"
import ChangeAvatar from "./ChangeAvatar"
import UserInfo from "../common/UserInfo"
import NavBar from "../common/NavBar"
import {onLogout, updateCurrentUser} from "../../utils/utils";
import BasicAlert from "../common/BasicAlert";

class Setting extends Component {
    constructor(props) {
        super(props)

        this.api = new BBSApi()
        this.state = {
            currentUser: null,
            showAlert: false,
            alertBody: '',
            alertTitle: '',
        }
    }

    componentDidMount() {
        this.onUpdateUserInfo()
    }

    onUpdateUserInfo = () => {
        updateCurrentUser(this)
    }

    onCancelAlert = () => {
        this.setState({
            showAlert: false,
        })
    }

    toggleShow = () => {
        this.setState((prev) => ({
            showAlert: !prev.showAlert,
        }))
    }

    onShowAlert = (title, error) => {
        this.setState({
            showAlert: true,
            alertBody: error,
            alertTitle: title,
        })
    }

    render() {
        return (
            <div>
                <NavBar api={this.api} user={this.state.currentUser} onLogout={onLogout(this)}/>
                <div id="main">
                    <div id="sidebar" className="float-right">
                        <UserInfo user={this.state.currentUser}/>
                    </div>
                    <div id="content">
                        <div className="setting-container">
                            <ChangePassword onChange={this.onUpdateUserInfo} api={this.api}
                                            onShowAlert={this.onShowAlert}/>
                            <ChangeSignature onChange={this.onUpdateUserInfo} api={this.api}
                                             user={this.state.currentUser} onShowAlert={this.onShowAlert}/>
                            <ChangeAvatar onChange={this.onUpdateUserInfo} api={this.api}
                                          onShowAlert={this.onShowAlert}/>
                        </div>
                        <BasicAlert title={this.state.alertTitle} body={this.state.alertBody}
                                    toggleShow={this.toggleShow}
                                    show={this.state.showAlert}/>
                    </div>
                </div>
            </div>

        )
    }
}

export default Setting