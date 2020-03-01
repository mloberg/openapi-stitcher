const path = require("path");
const express = require("express");
const socket = require("socket.io");
const { createServer } = require("http");
const { watch } = require("chokidar");
const { stitch } = require("./utils");

const sendSpec = (spec, sock) => {
    sock.emit("updateSpec", spec);
}

module.exports = (input, rebuild) => {
    const app = express();
    const server = createServer(app);
    const io = socket(server);

    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, "ui.html"));
    });

    app.use(express.static(require("swagger-ui-dist").getAbsoluteFSPath()));
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    io.on("connection", (sock) => {
        sock.on("uiReady", () => sendSpec(stitch(input), sock));
    });

    if (rebuild) {
        watch(input, { ignoreInitial: true }).on("all", () => sendSpec(stitch(input), io.sockets));
    }

    return server;
};
