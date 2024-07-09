let root = document;
if (typeof _root !== 'undefined') root = _root;
let props = win.scriptsdata[Object.keys(win.scriptsdata)[0]].config.props;
const category = win.scriptsdata[Object.keys(win.scriptsdata)[0]].config.category;

root.getElementsByClassName('floating-ball')[0].onclick = () => {
    const configPanel = root.getElementsByClassName('config-panel')[0];
    const container = root.getElementsByClassName('container')[0];
    const floatingBall = root.getElementsByClassName('floating-ball')[0];
    const floatingBallIcon = root.getElementsByClassName('floating-ball-icon')[0];
    const ballToPanel = root.getElementsByClassName('ball-to-panel')[0];
    const panel = root.getElementsByClassName('panel')[0];
    const panelMain = root.getElementsByClassName('panel-main')[0];

    floatingBall.style.display = 'none';
    ballToPanel.style.display = 'flex';
    panel.style.display = 'block';

    setTimeout(() => {
        panelMain.style.display = 'block';
        setTimeout(() => {
            panel.style.overflow = 'visible';
            panelMain.classList.remove('less-visible');
        }, 500)
    }, 500);
}
root.getElementsByClassName('closeBtn')[0].onclick = () => {
    const configPanel = root.getElementsByClassName('config-panel')[0];
    const container = root.getElementsByClassName('container')[0];
    const floatingBall = root.getElementsByClassName('floating-ball')[0];
    const floatingBallIcon = root.getElementsByClassName('floating-ball-icon')[0];
    const ballToPanel = root.getElementsByClassName('ball-to-panel')[0];
    const panel = root.getElementsByClassName('panel')[0];
    const panelMain = root.getElementsByClassName('panel-main')[0];

    const time = '0.5s'
    ballToPanel.style.animation = `collapsePanel ${time} ease-out`;

    setTimeout(() => {
        ballToPanel.style.display = 'none';
        panel.style.display = 'none';
        ballToPanel.style.animation = "ballToPanel 1.5s ease-out 0.25s 1 forwards";
        panelMain.style.display = 'none';
    }, 500)
    floatingBall.style.display = 'flex';
    panel.style.overflow = 'hidden';
    panelMain.classList.add('less-visible');

}
root.getElementsByClassName('floating-ball')[0].onclick()


const panelMain = root.getElementsByClassName('panel-main')[0];
const categoryList = root.getElementsByClassName('category-list')[0];

for (const item of category) {
    categoryList.insertAdjacentHTML('beforeend', `
        <input type="radio" name="categoryTabs" role="tab" class="tab h-fit" aria-label="${item.display}" />
        <div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-6">
            <div class="category-${item.key}-content flex flex-col gap-1"></div>
        </div>
    `)
}

const get = (dv) => dv;



for (const key of Object.keys(props)) {
    const item = props[key]
    const defaultValue = item.defaultValue
    const type = item.type
    const options = item.options
    const display = item.display
    const category = item.category
    const content = root.getElementsByClassName(`category-${item.category}-content`)[0];

    if (type === 'bool') {
        content.insertAdjacentHTML('beforeend', `
            <div class="form-control bg-base-200 p-4  rounded-box">
                <label class="label cursor-pointer">
                    <span class="label-text">${display}</span>
                    <input type="checkbox" class="toggle toggle-primary" ${get(defaultValue) ? 'checked' : ''} />
                </label>
            </div>
            <br/>
        `)
    }
    else if (type === 'option') {
        content.insertAdjacentHTML('beforeend', `
            <div class="form-control bg-base-200 p-4  rounded-box">
                <label class="label cursor-pointer">
                    <span class="label-text">${display}</span>
                    <select class="select select-bordered">
                        ${options.map(option => `
                            <option value="${option.key}">${option.display}</option>
                        `).join('')}
                    </select>
                </label>
            </div>
            <br/>
        `)
    }

}