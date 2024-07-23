({
  name: "评论过滤",
  pages: ["video", "read"],
  showInMenu: true,
  value: (f) => {
    var rules = f.rules()
    const check = (x) => {
      try {
        // 获取回复内容元素
        const ctx = x.getElementsByClassName("reply-content")[0];
        // 如果已处理或内容为空则跳过
        if (x.classList.contains("🎇checked") || ctx.innerHTML === "") return;
        // 标记元素x已处理
        x.classList.add("🎇checked");
        // 如果回复内容文字长度大于限制(25)则跳过
        if (Number(ctx.outerText) > get("filter_length_limit", 25)) return;
        if (ctx.innerHTML !== "" && ctx.innerText === "") return

        for (const r of rules) {
          if (r.test((x.getElementsByClassName("reply-content")[0].outerText))) {
            x.classList.add("🎇filtered");
            console.log(`已屏蔽: ${x.getElementsByClassName("reply-content")[0].outerText} \n 规则: ${r.toString()}`);
            break;
          }
        }
      } catch (e) {
        x.classList.add("🎇checked");
      }
    }

    delay(() => {
      for (const x of document.getElementsByClassName("reply-item")) check(x);
      for (const x of document.getElementsByClassName("sub-reply-item")) check(x);
    }, 2000, { loop: true })

    return `.🎇filtered{display:none;}`;
  }, rules: () => {
    try {
      return get("filter_rules").split("\n")
        .filter((x) => x.trim() !== "")
        .map((x) => {
          if (x.startsWith("/") && x.endsWith("/")) {
            return x.substring(1, x.length - 1);
          }
          return x;
        })
        .filter((x) => x.trim() !== "")
        .map((x) => new RegExp(x));
    } catch (error) {
      console.error(error);
      return [];
    }
  }
})