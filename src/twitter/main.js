String.prototype.hashCode = function () {
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};


const urlListenCallbacks = []
function UrlListener(callback) {
    urlListenCallbacks.push(callback)
}
let old_url = "";
setInterval(() => {
    if (old_url != window.location.href) {
        urlListenCallbacks.forEach(callback => callback(
            {
                old_url: old_url,
                new_url: window.location.href
            }
        ))
        old_url = window.location.href
    }
}, 500)

const rules = []

function loadRule(str) {
    if (!str || str.trim() === '') return;
    let key;
    const rule = {};
    str.split('\n').forEach(line => {
        line = line.trim();
        if (!line) return;

        if (line.startsWith('#')) {
            key = line.slice(1).trim();
            if (key.startsWith('rule-'))
                rule[key] = '';
            else
                rule[key] = [];

        } else {
            if (rule[key] instanceof Array)
                rule[key].push(line.trim());
            else
                rule[key] += line.trim();
        }
    });
    rules.push(rule);
}
