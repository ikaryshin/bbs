import React, {Component} from 'react'
// import a as b from module 相当于给 a 模块起了一个别名 b,
// 这样在其他地方使用可以直接使用 b 这个变量名
import {BrowserRouter as Router, Route} from 'react-router-dom'

import './css/index.css'

import Login from './components/authentication/Login'
import NewTopic from './components/topic/NewTopic'
import Index from './components/Index'
import Profile from './components/profile/Profile'
import Setting from "./components/setting/Setting";
import TopicView from "./components/topic/TopicView";
import ResetPassword from "./components/authentication/ResetPassword";
import Register from "./components/authentication/Register";
import ResetPasswordForm from "./components/authentication/ResetPasswordForm";
import Message from "./chat/Message";


class App extends Component {
    render() {
        return (
            // BrowserRouter 会使用 HTML5 的 history API 渲染单页路由

                <Router>
                    {/*Router 只能有一个子元素*/}
                    {/*Route 组件用来匹配 location.path 的值, 并且渲染相应的组件 */}
                    {/*exact 表示路径完全匹配时才算匹配*/}
                    {/*比如 /todo/1 与 /todo 并不是完全匹配, 与 /todo/:id 完全匹配*/}
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/register" component={Register} />
                    <Route exact path="/" component={Index} />
                    <Route exact path="/profile" component={Profile} />
                    <Route exact path="/user/:id" component={Profile} />
                    <Route exact path="/new" component={NewTopic} />
                    <Route exact path="/setting" component={Setting} />
                    <Route exact path="/topic/:id" component={TopicView} />
                    <Route exact path="/reset/view" component={ResetPasswordForm} />
                    <Route exact path="/reset" component={ResetPassword} />
                    <Route exact path="/chat" component={Message} />
                </Router>
        )
    }
}

export default App
