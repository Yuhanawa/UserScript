// Configuration and initialization
const root = typeof _root !== 'undefined' ? _root : document;
const scriptKey = Object.keys(win.scriptsdata)[0];
const { props, category } = win.scriptsdata[scriptKey].config;
const cfg = (k, v) => {
    console.log(`${k}: Set to ${v}`);
    return win.scriptsdata[scriptKey].cfg(k, v);
};

// UI elements
const elements = {
    floatingBall: root.querySelector('.floating-ball'),
    configPanel: root.querySelector('.config-panel'),
    container: root.querySelector('.container'),
    floatingBallIcon: root.querySelector('.floating-ball-icon'),
    ballToPanel: root.querySelector('.ball-to-panel'),
    panel: root.querySelector('.panel'),
    panelMain: root.querySelector('.panel-main'),
    closeBtn: root.querySelector('.closeBtn'),
    categoryList: root.querySelector('.category-list')
};

// Helper functions
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const toggleElementDisplay = (element, display) => element.style.display = display;

// Panel animation functions
async function animatePanel(isOpening) {
    const { floatingBall, ballToPanel, panel, panelMain } = elements;
    
    if (isOpening) {
        toggleElementDisplay(floatingBall, 'none');
        toggleElementDisplay(ballToPanel, 'flex');
        toggleElementDisplay(panel, 'block');

        await delay(500);
        toggleElementDisplay(panelMain, 'block');
        await delay(500);

        panel.style.overflow = 'visible';
        panelMain.classList.remove('less-visible');
    } else {
        ballToPanel.style.animation = 'collapsePanel 0.5s ease-out';
        panel.style.overflow = 'hidden';
        panelMain.classList.add('less-visible');

        await delay(500);

        toggleElementDisplay(ballToPanel, 'none');
        toggleElementDisplay(panel, 'none');
        toggleElementDisplay(floatingBall, 'flex');
        toggleElementDisplay(panelMain, 'none');

        ballToPanel.style.animation = "ballToPanel 1.5s ease-out 0.25s 1 forwards";
    }
}

// Event listeners
elements.floatingBall.onclick = () => animatePanel(true);
elements.closeBtn.onclick = () => animatePanel(false);

// Generate category tabs
function generateCategoryTabs() {
    const tabsHTML = category.map(item => `
        <input type="radio" name="categoryTabs" role="tab" class="tab h-fit" aria-label="${item.display}" />
        <div role="tabpanel" class="tab-content overflow-y-auto bg-base-100 border-base-300 rounded-box p-4" style="max-height: 80vh">
            <div class="category-${item.key}-content flex flex-col gap-0.5"></div>
        </div>
    `).join('');
    
    elements.categoryList.insertAdjacentHTML('beforeend', tabsHTML);
}

// Create base element
function createBaseElement(content, cfg, key, item, inputElement) {
    const { display } = item;
    const outerDiv = document.createElement('div');
    outerDiv.className = 'form-control bg-base-200 p-4 rounded-box';

    const label = document.createElement('label');
    label.className = 'label cursor-pointer';

    const span = document.createElement('span');
    span.className = 'label-text';
    span.textContent = display;

    label.append(span, inputElement);
    outerDiv.appendChild(label);
    content.append(outerDiv, document.createElement('br'));
}

// Setting widget creators
let settingWidgetCreators = {
    note: (content, cfg, key, item) => {
        const note = document.createElement('div');
        note.className = 'alert alert-info';
        note.textContent = item.display || '';
        content.append(note, document.createElement('br'));
    },
    bool: (content, cfg, key, item) => {
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.className = 'toggle toggle-primary';
        input.checked = cfg(key);
        input.onchange = (e) => cfg(key, e.target.checked);
        createBaseElement(content, cfg, key, item, input);
    },
    option: (content, cfg, key, item) => {
        const select = document.createElement('select');
        select.className = 'select select-bordered';
        select.innerHTML = item.options.map(option => 
            `<option value="${option.key}">${option.display}</option>`
        ).join('');
        select.value = cfg(key);
        select.onchange = (e) => cfg(key, e.target.value);
        createBaseElement(content, cfg, key, item, select);
    },
    text: createInputElement('text'),
    richtext: (content, cfg, key, item) => {
        const textarea = document.createElement('textarea');
        textarea.className = 'textarea textarea-bordered h-24';
        textarea.value = cfg(key);
        textarea.onchange = (e) => cfg(key, e.target.value);
        createBaseElement(content, cfg, key, item, textarea);
    },
    image: (content, cfg, key, item) => {
        const container = document.createElement('div');
        container.className = 'flex flex-col space-y-2';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'input input-bordered';
        input.placeholder = 'Enter image link or choose file';
        input.value = cfg(key) || '';

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.className = 'file-input file-input-bordered';

        const preview = document.createElement('img');
        preview.className = 'max-w-xs max-h-48 object-contain';
        preview.src = cfg(key) || '';
        preview.style.display = cfg(key) ? 'block' : 'none';

        const updateImage = (src) => {
            preview.src = src;
            preview.style.display = src ? 'block' : 'none';
            cfg(key, src);
        };

        input.onchange = (e) => updateImage(e.target.value);
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    updateImage(e.target.result);
                    input.value = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        };

        container.append(input, fileInput, preview);
        createBaseElement(content, cfg, key, item, container);
    },
    color: (content, cfg, key, item) => {
        const container = document.createElement('div');
        container.className = 'flex space-x-2';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'input input-bordered';
        input.placeholder = '#000000';
        input.value = cfg(key) || '';

        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.className = 'h-10';
        colorPicker.value = cfg(key) || '#000000';

        const updateColor = (color) => {
            input.value = color;
            colorPicker.value = color;
            cfg(key, color);
        };

        input.onchange = (e) => {
            const color = e.target.value;
            if (/^#[0-9A-F]{6}$/i.test(color)) {
                updateColor(color);
            }
        };

        colorPicker.onchange = (e) => updateColor(e.target.value);

        container.append(input, colorPicker);
        createBaseElement(content, cfg, key, item, container);
    },
    number: createInputElement('number')
};

function createInputElement(type) {
    return (content, cfg, key, item) => {
        const input = document.createElement('input');
        input.type = type;
        input.className = 'input input-bordered';
        input.value = cfg(key);
        input.onchange = (e) => cfg(key, type === 'number' ? parseFloat(e.target.value) : e.target.value);
        createBaseElement(content, cfg, key, item, input);
    };
}

// Generate settings UI
function generateSettingsUI(root, props, cfg) {
    Object.entries(props).forEach(([key, item]) => {
        const content = root.querySelector(`.category-${item.category}-content`);
        if (content && settingWidgetCreators[item.type]) {
            settingWidgetCreators[item.type](content, cfg, key, item);
        } else {
            console.error(`generateSettingsUI: Can't find category ${item.category}`);
        }
    });
}

// Initialize
generateCategoryTabs();
generateSettingsUI(root, props, cfg);
elements.floatingBall.click();