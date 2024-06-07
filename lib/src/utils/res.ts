import fs from "fs-extra";
import path from "path";

function get_core_utils() : string {    
    return fs.readFileSync(path.resolve(__dirname,"..","..","..","res/core_utils.js"), "utf8");
}

export default { get_core_utils }