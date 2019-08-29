import React, {Component} from 'react'
import NavBar from './common/NavBar'
import BBSApi from "../api/bbs_api"
import SideBar from "./common/SideBar";
import TopicList from "./topic/TopicList";
import {onLogout, queryFromComponent, redirect} from "../utils/utils";
import Pager from "./common/Pager";

function BoardButton(props) {
    let currentBoard = parseInt(props.currentBoard)
    let boardTitle = props.boardTitle
    let boardID = parseInt(props.boardID)
    let onChangeBoard = props.onChangeBoard

    let highlighted = currentBoard === boardID ? `highlighted-board-button` : ''
    return (
        <button id={`board-${boardID}`} className={`link-button board-button ${highlighted}`}
                onClick={onChangeBoard}>{`${boardTitle}`}</button>
    )
}

class Index extends Component {
    constructor(props) {
        super(props)
        this.api = new BBSApi()
        this.state = {
            topics: null,
            user: null,
            boards: null,
            boardID: this.boardIDFromQuery(),
            loaded: false,
            currentPage: 1,
            topicCount: 0,
        }
    }

    componentDidMount() {
        this.api.user((r) => {
            this.setState({
                user: r.user,
            })
        })

        this.api.topicsByBoard(this.state.boardID, (r) => {
            let topics = r.topics
            let topicCount = r.count
            this.api.allBoards((r) => {
                let boards = r.boards
                this.setState({
                    topics: topics,
                    boards: boards,
                    loaded: true,
                    topicCount: topicCount,
                })
            })
        })
    }

    boardIDFromQuery = () => {
        let {board} = queryFromComponent(this)
        board = parseInt(board) || 0
        return board
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let board = this.boardIDFromQuery()
        if (board !== this.state.boardID) {
            this.changeBoard(board)
        }
    }

    changeBoard = (boardID) => {
        this.api.topicsByBoard(boardID, (r) => {
            console.log('change board', r)
            this.setState({
                topics: r.topics,
                boardID: boardID,
                topicCount: r.count,
                count: r.count,
            })
        })
    }

    onChangeBoard = (e) => {
        let boardID = Number(e.target.id.split('-')[1])
        redirect(this, `/?board=${boardID}`)
    }

    onChangePage = (e) => {
        let page = Number(e.target.id.split('-')[1])
        this.api.topicByPage(page, this.state.boardID, (r) => {
            this.setState({
                topics: r.topics,
                currentPage: page,
            })
        })
    }

    render() {
        let content
        if (this.state.loaded) {
            let topics = (
                <div className="topic-list">
                    <TopicList topics={this.state.topics}/>
                </div>
            )

            let boards = (
                <div className="header">
                    <BoardButton key="0" boardID="0" boardTitle="全部"
                                 currentBoard={this.state.boardID} onChangeBoard={this.onChangeBoard}/>
                    {
                        this.state.boards.map((board) => (
                            <BoardButton key={board.id} boardID={board.id} boardTitle={board.title}
                                         currentBoard={this.state.boardID} onChangeBoard={this.onChangeBoard}/>
                        ))
                    }
                </div>
            )

            content = (
                <div id="content" className="topic-list-container">
                    {boards}
                    {topics}
                    <Pager pageCount={this.state.topicCount} onChangePage={this.onChangePage}
                           currentPage={this.state.currentPage}/>
                </div>
            )
        } else {
            content = ''
        }
        return (
            <div id="container">
                <NavBar user={this.state.user} onLogout={onLogout(this)}/>

                <div id="main">
                    <SideBar user={this.state.user}/>
                    {content}
                </div>
            </div>
        )
    }
}

export default Index