import server from './config'

const serverName = `http://${server}`

const apiBaseUrl = `${serverName}/api`

export {
    server,
    apiBaseUrl,
    serverName,
}