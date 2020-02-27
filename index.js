#!/usr/bin/env node
'use strict';

const fs = require("fs");
const { watch } = require("chokidar");
const { stitch } = require("./utils");
const open = require("open");

require("yargs")
    .command("build [glob] [output]", "Stitch together an OpenAPI specification", (builder) => {
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
        fs.writeFileSync(args.output, stitch(args.glob));
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
        watch(args.glob).on("all", () => {
            fs.writeFileSync(args.output, stitch(args.glob));
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

        if (args.open) {
            open(`http://localhost:${args.port}`);
        }

        console.log(`Listening on http://localhost:${args.port}`);
    })
    .argv;
