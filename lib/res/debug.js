
if (!unsafeWindow.scriptsdata) {
    unsafeWindow.scriptsdata = {};
}
unsafeWindow.scriptsdata[config.name] = {
    cfg: cfg,
    config: config,
    openConfigPanel: openConfigPanel
}

