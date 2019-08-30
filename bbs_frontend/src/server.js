import {server, useHTTPS} from './config'

let protocol = useHTTPS ? 'https' : 'http'

const serverName = `${protocol}://${server}`

const apiBaseUrl = `${serverName}/api`

export {
    server,
    apiBaseUrl,
    serverName,
}