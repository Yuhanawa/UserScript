function parse(content) {
    // 获取所有元数据属性
    const metadata = {};
    const metaDataStart = content.indexOf("// ==UserScript==");
    const metaDataEnd = content.indexOf("// ==/UserScript==");
    const metaDataSection = content.substring(metaDataStart, metaDataEnd);

    metaDataSection.split("\n").forEach(line => {
        if (line.includes("// @")) {
            const splitLine = line.split("// @")[1].split(" ");

            let key = splitLine[0].trim();
            let value = " "
            if (splitLine.includes('')) {
                key = splitLine.shift().trim();
                value = splitLine.join(" ").trim();
            }

            if (metadata[key] == undefined) {
                metadata[key] = [value];
            } else {
                metadata[key].push(value);
            }
        }
    });
    return metadata
}

function toString(metadata) {
    let content = "// ==UserScript==\n";

    let keys = Object.keys(metadata);

    keys.sort((star, next) => {

        var order = ['name', 'description', 'version', 'author', 'namespace', 'homepage', 'homepageURL', 'website', 'source', 'supportURL'
            , 'copyright', 'license', 'antifeature', 'include', 'exclude', 'match', 'icon', 'iconURL', 'defaulticon', 'icon64', 'icon64URL', 'updateURL', 'downloadURL',
            'require', 'resource', 'webRequest', 'connect', 'grant', 'run-at', 'sandbox', 'noframes', 'unwrap'
        ];
        if (star.includes('name') && next.includes('name')) {
            return star.length - next.length
        }
        if (star.includes('name') || next.includes('name')) {
            return star.includes('name') ? -1 : 1
        }
        if (star.includes('description') && next.includes('description')) {
            return star.length - next.length
        } if (star.includes('description') || next.includes('description')) {
            return star.includes('description') ? -1 : 1
        }

        return order.indexOf(star.type) - order.indexOf(next.type)
    })
    keys.forEach(key => {
        if (typeof metadata[key] == "string") {
            content += `// @${key}\t\t${metadata[key]}\n`;

        } else {
            metadata[key].forEach(value => {
                content += `// @${key}\t\t${value}\n`;
            });
        }

    });

    content += "// ==/UserScript==";

    // // content现在包含重构后的元数据
    // console.log(content);
    return content
}

module.exports = {
    headerParse: parse,
    header2str: toString
}