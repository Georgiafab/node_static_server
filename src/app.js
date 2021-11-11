const http = require('http')
const chalk = require('chalk')
const path = require('path')
const fs = require('fs')
const conf= require('./config/defaultConfig')

const server = http.createServer((req, res) => {

    const filePath = path.join(conf.root, req.url)
    fs.stat(filePath, (err, stats) => {
        if (err) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain')
            res.end(`${filePath} 不是一个文件夹或者文件`)
            return
        }
        if (stats.isFile()) {
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/plain')
            fs.createReadStream(filePath).pipe(res)
        } else if (stats.isDirectory()) {
            fs.readdir(filePath, (err, files) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'text/plain')
                fs.createReadStream(filePath).pipe(res)
            })
        }
    })
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    res.end(filePath)
})

server.listen(conf.port, conf.hostname, () => {
    console.info(`服务器运行在 ${chalk.green(`http://${conf.hostname}:${conf.port}`)}/`)
})