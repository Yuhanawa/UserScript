name: '',
match: [],
values: {
    已关闭:null,
    已开启: () => {
        cfg("get");
        cfg("set", "value");
        cfg_get("value", "default");
        cfg_set("value", "default");
        return $SASS(css/test.sass)
    }
}
