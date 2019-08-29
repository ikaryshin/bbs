import Api from './api'


class BBSApi extends Api {
    login(username, password, callback) {
        let path = '/login'
        let data = {
            username,
            password,
        }
        this.post(path, data, callback)
    }

    register(username, password, callback) {
        let path = '/register'
        let data = {
            username,
            password,
        }
        this.post(path, data, callback)
    }

    index(callback) {
        let path = '/index'
        this.get(path, callback)
    }

    topicByPage(page, board, callback) {
        let path = `/index?board=${board}&page_num=${page}`
        this.get(path, callback)
    }

    topicsByBoard(boardID, callback) {
        if (boardID === 0) {
            boardID = -1
        }
        let path = `/index?board_id=${boardID}`
        this.get(path, callback)
    }

    resetPassword(username, callback) {
        let path = '/reset/send'
        let data = {
            username,
        }
        this.post(path, data, callback)
    }


    user(callback) {
        let path = '/user'
        let data = {
            token: localStorage['token']
        }
        this.post(path, data, callback)
    }

    userByID(id, callback) {
        let path = `/user/${id}`
        this.get(path, callback)
    }

    changePassword(oldPassword, newPassword, callback) {
        let path = '/setting/password'
        let data = {
            'token': localStorage['token'],
            'current-password': oldPassword,
            'new-password': newPassword,
        }
        this.post(path, data, callback)
    }

    changeProfile(username, signature, email, callback) {
        let path = '/setting/profile'
        let data = {
            token: localStorage['token'],
            name: username,
            signature: signature,
            email: email,
        }
        this.post(path, data, callback)
    }

    createTopic(title, content, board, callback) {
        let path = '/topic/add'
        let data = {
            token: localStorage.token,
            title: title,
            content: content,
            board_id: board,
        }
        this.post(path, data, callback)
    }

    topicDetail(id, callback) {
        let path = `/topic/${id}`
        this.get(path, callback)
    }

    createReply(topicID, content, callback) {
        let path = '/reply/add'
        let data = {
            'token': localStorage.token,
            'topic_id': topicID,
            'content': content,
        }
        this.post(path, data, callback)
    }

    checkToken(token, callback) {
        let path = '/token'
        let data = {
            token: token || null,
        }
        this.post(path, data, callback)
    }

    resetPasswordUpdate(token, password, callback) {
        let path = '/reset/update'
        let data = {
            token,
            password,
        }
        this.post(path, data, callback)
    }

    addAvatar(form, callback) {
        let path = `${this.baseUrl}/image/add?token=${localStorage.token}`

        form.append('token', localStorage.token)
        let data = form

        let r = new XMLHttpRequest()
        r.open('post', path, true)
        r.onreadystatechange = () => {
            if (r.readyState === 4) {
                let response = JSON.parse(r.response)
                callback(response)
            }
        }
        r.send(data)
    }


    profile(callback) {
        let path = '/profile'
        let token = localStorage.token
        let data = {
            token,
        }
        this.post(path, data, callback)
    }

    newChat(id, callback) {
        let path = '/chat/new'
        let token = localStorage.token
        let data = {
            token,
            receiver_id: id,
        }
        this.post(path, data, callback)
    }

    allContacts(callback) {
        let path = '/chat/contacts'
        let token = localStorage.token
        let data = {
            token,
        }
        this.post(path, data, callback)
    }

    allMessages(room, callback) {
        let path = '/chat/messages'
        let token = localStorage.token
        let data = {
            token,
            room,
        }
        this.post(path, data, callback)
    }

    allBoards(callback) {
        let path = '/topic/boards'
        this.get(path, callback)
    }
}


export default BBSApi
