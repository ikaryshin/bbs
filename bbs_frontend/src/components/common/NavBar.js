import React, {Component} from 'react'
import {Link} from "react-router-dom";
import Navigation from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavLink from "react-bootstrap/NavLink";
import {isLogged} from "../../utils/utils";


class NavBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            loaded: false,
            logged: false,
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!this.state.loaded && this.props.user !== null) {
            let user = this.props.user
            this.setState({
                username: user.username,
                loaded: true,
                logged: isLogged(user),
            })
        }
    }

    onLogout = () => {
        this.props.onLogout()
        this.setState({
            logged: false,
        })
    }

    render() {
        let auth
        if (this.state.loaded) {
            if (this.state.logged) {
                let {username, id} = this.props.user
                auth = (
                    <Nav className="navbar-nav">
                        <Link className="nav-link active" to={`/user/${id}`}>{username}</Link>
                        <Link className="nav-link active" to={'/chat'}>私信</Link>
                        <NavLink className="nav-link active" onClick={this.onLogout}>登出</NavLink>
                    </Nav>
                )
            } else {
                auth = (
                    <Nav className="navbar-nav">
                        <Link className="nav-link active" to="/register">注册</Link>
                        <Link className="nav-link active" to="/login">登录</Link>
                    </Nav>
                )
            }
        } else {
            auth = ''
        }

        return (
            <Navigation expand="md" className="navbar-dark bg-dark">
                <Link className="navbar-brand" to="/">BBS</Link>
                <Navigation.Toggle aria-controls="navbar"/>
                <Navigation.Collapse id="navbar">
                    <Nav className="navbar-nav mr-auto">
                        <Link className="nav-link active" to="/">首页</Link>
                        <Link className="nav-link active" to="/new">发布话题</Link>
                    </Nav>
                    {auth}
                </Navigation.Collapse>
            </Navigation>
        )
    }
}

export default NavBar