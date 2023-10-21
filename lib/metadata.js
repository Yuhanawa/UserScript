export function parse(content) {
    // 获取所有元数据属性
    const metadata = {};
    const metaDataStart = content.indexOf("// ==UserScript==");
    const metaDataEnd = content.indexOf("// ==/UserScript==");
    const metaDataSection = content.substring(metaDataStart, metaDataEnd);

    metaDataSection.split("\n").forEach(line => {
        if (line.includes("// @")) {
            const splitLine = line.split("// @");
            const key = splitLine[1].trim();
            const value = splitLine[2].trim();
            metadata[key] = value;
        }
    });
    return metadata
    // // 示例:获取name属性
    // const name = metadata.name;

    // console.log(metadata);
    // console.log(name);
}

export function toString(metadata) {
    // // metadata对象包含了解析后的元数据
    // const metadata = {
    //     "name": "Script Name",
    //     "namespace": "http://example.com",
    //     "version": "1.0",
    //     "description": "Description",
    //     // 其他元数据
    // };

    let content = "// ==UserScript==\n";

    Object.keys(metadata).forEach(key => {
        content += `// @${key} ${metadata[key]}\n`;
    });

    content += "// ==/UserScript==";

    // // content现在包含重构后的元数据
    // console.log(content);
    return content
}