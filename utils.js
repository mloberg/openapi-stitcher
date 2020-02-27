const fs = require("fs");
const glob = require("glob");
const merge = require("deepmerge");
const { safeDump, safeLoad } = require("js-yaml");

function read(filename) {
    const content = fs.readFileSync(filename).toString("utf8");

    if (wantsJson(filename)) {
        return JSON.parse(content);
    }

    return safeLoad(content);
}

function wantsJson(filename) {
    return filename.indexOf(".json") > 0;
}

exports.wantsJson = wantsJson;
exports.stitch = (input, asJson = false) => {
    const parts = glob.sync(input).map(file => read(file));
    const spec = merge.all(parts);

    if (asJson) {
        return JSON.stringify(spec, null, 2);
    }

    return safeDump(spec);
}
