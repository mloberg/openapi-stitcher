const fs = require("fs");
const glob = require("glob");
const merge = require("deepmerge");
const { safeDump, safeLoad } = require("js-yaml");

exports.stitch = (input) => {
    const parts = glob.sync(input).map((file) => {
        return safeLoad(fs.readFileSync(file).toString("utf8"));
    });
    const spec = merge.all(parts);

    return safeDump(spec);
}
