#!/usr/bin/env node
'use strict';

const fs = require("fs");
const { watch } = require("chokidar");
const { stitch, wantsJson } = require("./utils");
const open = require("open");

require("yargs")
    .command("build [glob] [output]", "Stitch together an OpenAPI specification", (builder) => {
        builder
            .positional("glob", {
                describe: "Source files to build spec from",
                default: "spec/**/*.{yaml,yml,json}"
            })
            .positional("output", {
                describe: "Specification file to output",
                default: "openapi.yaml",
            });
    }, (args) => {
        const isJson = wantsJson(args.output);
        const spec = stitch(args.glob, isJson);
        fs.writeFileSync(args.output, spec);
    })
    .command("watch [glob] [output]", "Watch for changes and rebuild the specification", (builder) => {
        builder
            .positional("glob", {
                describe: "Source files to build spec from",
                default: "spec/**/*.{yaml,yml}"
            })
            .positional("output", {
                describe: "Specification file to output",
                default: "openapi.yaml",
            });
    }, (args) => {
        const isJson = wantsJson(args.output);
        watch(args.glob).on("all", () => {
            const spec = stitch(args.glob, isJson);
            fs.writeFileSync(args.output, spec);
        });
    })
    .command("serve [spec] [port]", "Serve OpenAPI specification via SwaggerUI", (builder) => {
        builder
            .positional("spec", {
                describe: "OpenAPI specification file",
                default: "openapi.yaml",
            })
            .positional("port", {
                describe: "Port to bind to",
                default: 3000,
            })
            .option("open", {
                describe: "Open default browser",
                boolean: true,
                default: false,
            })
            .option("watch", {
                describe: "Files to watch and rebuild",
                boolean: true,
                default: false,
            });
    }, (args) => {
        require("./serve")(args.spec, args.watch).listen(args.port);
        const url = `http://localhost:${args.port}`;

        if (args.open) {
            open(url);
        }

        console.log(`Listening on ${url}`);
    })
    .argv;
