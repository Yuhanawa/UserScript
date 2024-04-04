name: sidenav
match:
    - /www.cnblogs.com\/[^\/]*$/
    - /www.cnblogs.com\/(sitehome|pick|candidate|subscription|following|aggsite|cate|comment)\//
directlyRun: true
switchable: true
    ,
    () => {
        onload(() => {
            const sidenav = document.getElementsByClassName('sidenav')[0]
            function insertNavItem(pos, id, href, title, icon) {
                const li = document.createElement('li');
                li.id = id
                li.className = "sidenav-item"
                li.innerHTML =
                    `<a href="${href}" title="${title}">
                        <img src="${icon}">
                        <span>${title}</span>
                    </a>`
                sidenav.insertAdjacentElement(pos, li)
                return li
            }
            const sidenav_ing = insertNavItem("afterBegin", "sidenav_ing", "#ing", "闪存", "https://assets.cnblogs.com/images/ing/lucky-star-3-1.png")
            sidenav_ing.addEventListener("click", () => show_ing_iframe())

            const sidenav_home = insertNavItem("afterBegin", "sidenav_home", "/", "主页", document.getElementById("user_icon").src)
            if (/www.cnblogs.com\/#ing*$/.test(location.href)) {
                sidenav_ing.className += " current-nav"
            } else if (/www.cnblogs.com\/[^\/]*$/.test(location.href)) {
                sidenav_home.className += " current-nav"
            }

            setTimeout(() => {
                sidenav_home.querySelector('img').src = document.getElementById("user_icon").src
            }, 320);
        })
    }