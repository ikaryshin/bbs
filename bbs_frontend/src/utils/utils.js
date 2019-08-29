import React from 'react'

import qs from "query-string";
import webSocket from "socket.io-client";
import {apiBaseUrl, server} from "../server"

const isLogged = (user) => {
    if (user !== null) {
        return user.id !== -1
    } else if (user === undefined) {
        return localStorage.token !== undefined
    } else {
        return false
    }
}

const updateCurrentUser = (component) => {
    component.api.user((r) => {
        component.setState({
            currentUser: r.user,
        })
    })
}

// const log = console.log.bind(console)
const log = () => {}

const redirect = (from, toPath) => {
    from.props.history.push(toPath)
}

const onLogout = (from) => {
    return () => {
        logout()
        redirect(from, '/login')
    }
}

const logout = () => {
    localStorage.clear()
}

const queryFromComponent = (component) => {
    return qs.parse(component.props.location.search)
}

const paramsFromComponent = (component) => {
    return component.props.match.params
}

const imageSrcFromName = (name) => {
    return `${apiBaseUrl}${name}`
}

const imageTagFromUser = (user, size) => {
    let sizeDict = {
        'big': 'user-big-avatar',
        'normal': 'user-avatar',
        'small': 'user-small-avatar',
    }
    let avatarSize = sizeDict[size]

    let img = ''
    if (user.image !== undefined) {
        img = (
            <img className={avatarSize} src={imageSrcFromName(user.image)} alt={user.username}/>
        )
    }
    return img
}

const bigAvatarFromUser = (user) => {
    return imageTagFromUser(user, 'big')
}

const smallAvatarFromUser = (user) => {
    return imageTagFromUser(user, 'small')
}

const avatarFromUser = (user) => {
    return imageTagFromUser(user, 'normal')
}

const topicLinkFromID = (id) => {
    return `${apiBaseUrl}/topic/${id}`
}

const userLinkFromID = (id) => {
    return `/user/${id}`
}

const floorDivision = (a, b) => {
    let divided = a / b
    return Math.floor(divided)
}

const timeElapsed = (timestamp) => {
    if (timestamp === undefined) {
        return ''
    }
    const seconds_per_minute = 60
    const seconds_per_hour = seconds_per_minute * 60
    const seconds_per_day = seconds_per_hour * 24
    const seconds_per_year = seconds_per_day * 365

    let now = Date.now() / 1000
    let time_passed = now - timestamp

    let formatted
    if (time_passed < seconds_per_minute) {
        formatted = "不到 1 分钟"
    } else if (seconds_per_minute < time_passed && time_passed < seconds_per_hour) {
        let t = floorDivision(time_passed, seconds_per_minute)
        formatted = `${t} 分钟`
    } else if ((seconds_per_hour < time_passed) && (time_passed < seconds_per_day)) {
        let t = floorDivision(time_passed, seconds_per_hour)
        formatted = `${t} 小时`
    } else if (seconds_per_day < time_passed && time_passed < seconds_per_year) {
        let t = floorDivision(time_passed, seconds_per_day)
        formatted = `${t} 天`
    } else {
        let t = floorDivision(time_passed, seconds_per_year)
        formatted = `${t} 年`
    }

    return formatted + '前'
}

const updateUserCache = (token) => {
    localStorage.token = token
}

const connectWebSocket = (room, wss = true) => {
    let protocol = wss ? 'wss' : 'ws'
    let websocket = webSocket(`${protocol}://${server}/api/chat`, {transports: ['websocket']})

    let data = {
        room,
        token: localStorage.token,
    }
    websocket.emit('join', data)
    return websocket
}

const isHttps = () => {
    return window.location.protocol === 'https:'
}

const isHttp = () => {
    return window.location.protocol === 'http:'
}


export {
    redirect,
    queryFromComponent,
    paramsFromComponent,
    imageSrcFromName,
    imageTagFromUser,
    avatarFromUser,
    smallAvatarFromUser,
    bigAvatarFromUser,
    topicLinkFromID,
    timeElapsed,
    userLinkFromID,
    updateUserCache,
    connectWebSocket,
    log,
    onLogout,
    isLogged,
    updateCurrentUser,
    isHttp,
    isHttps,
}