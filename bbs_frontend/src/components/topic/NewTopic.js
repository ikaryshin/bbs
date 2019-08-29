import React, {Component} from 'react'
import 'react-mde/lib/styles/css/react-mde-all.css'

import MarkdownEditor from '../markdown/MarkdownEditor'
import BBSApi from '../../api/bbs_api';

import {onLogout, redirect} from '../../utils/utils'
import NavBar from "../common/NavBar"

import '../../css/topic-create.css'
import BasicAlert from "../common/BasicAlert";

class NewTopic extends Component {
    constructor(props) {
        super(props);
        this.api = new BBSApi()
        this.state = {
            text: '',
            title: '',
            showAlert: false,
            alertError: '',
            currentUser: null,
            loggedChecked: false,
            boards: null,
            board: -1,
        }
    }

    componentDidMount() {
        this.api.user((r) => {
            if (r.status) {
                this.setState({
                    currentUser: r.user,
                    loggedChecked: true,
                })
            } else {
                redirect(this, '/login')
            }
        })

        this.api.allBoards((r) => {
            this.setState({
                boards: r.boards,
            })
        })
    }

    onContentChange = (text) => {
        this.setState({
            text: text,
        })
    }

    onTitleChange = (e) => {
        this.setState({
            title: e.target.value,
        })
    }

    onBoardChange = (e) => {
        this.setState({
            board: e.target.value,
        })
    }

    onSubmit = (e) => {
        e.preventDefault()
        if (this.state.title.length <= 10) {
            this.setState({
                showAlert: true,
                alertError: '标题长度必须大于十个字',
            })
        } else if (this.state.text.length <= 10) {
            this.setState({
                showAlert: true,
                alertError: '帖子长度必须大于十个字',
            })
        } else {
            this.api.createTopic(
                this.state.title,
                this.state.text,
                Number(this.state.board),
                (r) => {
                    redirect(this, `/topic/${r.topic.id}`)
                }
            )
        }
    }

    toggleShow = () => {
        this.setState((prev) => ({
            showAlert: !prev.showAlert,
        }))
    }

    render() {
        let boardsOption
        if (this.state.boards !== null) {
            boardsOption = (
                <div className="form-group">
                    <select className="form-control" id="exampleFormControlSelect1" onChange={this.onBoardChange}>
                        <option value="-1">请选择板块</option>
                        {
                            this.state.boards.map((board) => (
                                <option key={board.id} value={board.id}>{board.title}</option>
                            ))
                        }
                    </select>
                </div>
            )
        } else {
            boardsOption = (
                <div className="form-group">
                    <select className="form-control" id="exampleFormControlSelect1">
                        <option value="-1">请选择板块</option>
                    </select>
                </div>
            )
        }

        let newTopic
        if (this.state.loggedChecked) {
            newTopic = (
                <div className="new-topic-container">
                    <div className="panel">
                        <div className="header">
                            <span>发布新帖子</span>
                        </div>
                        <div className="inner post">
                            <form className="form-horizontal" onSubmit={this.onSubmit}>
                                <textarea autoFocus className='title form-control'
                                          name='title' rows='1'
                                          placeholder="标题"
                                          value={this.state.title}
                                          onChange={this.onTitleChange}
                                />
                                <br/>
                                {boardsOption}
                                <MarkdownEditor text={this.state.text} onChange={this.onContentChange}/>
                                <div className="form-actions submit-topic-btn-container">
                                    <input type="submit" className="btn-primary submit-topic-btn"
                                           value="提交"/>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )
        } else {
            newTopic = ''
        }


        return (
            <div>
                <NavBar user={this.state.currentUser} onLogout={onLogout(this)}/>
                {newTopic}
                <BasicAlert show={this.state.showAlert} title="提交格式错误" body={this.state.alertError}
                            toggleShow={this.toggleShow}/>
            </div>
        )
    }
}

export default NewTopic