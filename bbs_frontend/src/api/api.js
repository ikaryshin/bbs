import {apiBaseUrl} from "../server"

const _ajax = (method, url, data, callback) => {
    let r = new XMLHttpRequest()
    r.open(method, url, true)
    r.setRequestHeader('Content-Type', 'application/json')
    r.onreadystatechange = () => {
        if (r.readyState === 4) {
            callback(r.response)
        }
    }
    if (method === 'POST') {
        data = JSON.stringify(data)
    }

    r.send(data)
}


class Api {
    constructor(baseUrl) {
        this.baseUrl = baseUrl || apiBaseUrl
    }

    get(path, callback) {
        let method = 'GET'
        let url = this.baseUrl + path
        _ajax(method, url, '', (r) => {
            let t = JSON.parse(r)
            callback(t)
        })
    }

    post(path, data, callback) {
        let url = this.baseUrl + path
        _ajax('POST', url, data, (r) => {
            let t = JSON.parse(r)
            callback(t)
        })
    }
}

export default Api
