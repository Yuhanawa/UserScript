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
    mainContainer: root.querySelector('.main-container'),
    floatingBall: root.querySelector('.floating-ball'),
    panel: root.querySelector('.panel'),
    panelMain: root.querySelector('.panel-main'),
    toolbar: root.querySelector('.toolbar'),
    closeBtn: root.querySelector('.closeBtn'),

    categoryContainer: root.querySelector('.category-Container'),
    contentContainer: root.querySelector('.content-Container'),
};
let contentDivs = new Map();

// Helper functions
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const toggleElementDisplay = (element, display) => element ? element.style.display = display : null;

// Panel animation functions
let panelIsOpening = false;
async function animatePanel(isOpening) {
    const { floatingBall, ballToPanel, panel, panelMain } = elements;

    panelIsOpening = isOpening;
    if (isOpening) {
        panel.classList.remove('hidden');
    } else {        
        panel.classList.add('hidden');
    }
}

// Event listeners
elements.floatingBall.onclick = () => animatePanel(!panelIsOpening);
elements.closeBtn.onclick = () => animatePanel(false);

//dragElement
let isDragging = false;
let startX, startY;
let initialLeft, initialTop;

// 鼠标按下时的处理函数
elements.toolbar.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    initialLeft = elements.mainContainer.offsetLeft;
    initialTop = elements.mainContainer.offsetTop;
    
    // 防止文本选中
    e.preventDefault();
});

// 鼠标移动时的处理函数
root.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    elements.mainContainer.style.left = `${initialLeft + dx}px`;
    elements.mainContainer.style.top = `${initialTop + dy}px`;
});

// 鼠标释放时的处理函数
elements.toolbar.addEventListener('mouseup', () => {
    isDragging = false;
});



// Generate category tabs
function generateCategoryTabs() {
    let current = null

    for (const item of category) {
        const categoryItem = document.createElement('li');
        categoryItem.className = 'cursor-pointer inline-flex items-center px-4 py-3 text-white bg-blue-700 rounded-lg active w-full dark:bg-blue-600';
        categoryItem.id = `category-${item.key}-tab`;
        categoryItem.innerHTML = `<svg class="w-4 h-4 me-2 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
        </svg>  <span>${item.display}</span>`

        const contentItem = document.createElement('div');
        contentItem.className = `content-container-item hidden`;
        contentItem.id = `content-${item.key}-container`;
        contentDivs.set(item.key, contentItem);

        categoryItem.onclick = () => {
            toggleElementDisplay(current, 'none');
            toggleElementDisplay(contentDivs.get(item.key), 'block');
            current = contentDivs.get(item.key);
        }

        elements.contentContainer.append(contentItem);
        elements.categoryContainer.append(categoryItem);
    }

}

// Create base element
function createBaseElement(content, cfg, key, item, inputElement) {
    const { display } = item;
    const outerDiv = document.createElement('div');
    outerDiv.className = 'bg-gray-100 p-4 rounded-lg';

    const label = document.createElement('label');
    label.className = 'flex items-center justify-between cursor-pointer';

    const span = document.createElement('span');
    span.className = 'text-sm font-medium text-gray-700';
    span.textContent = display;

    label.append(span, inputElement);
    outerDiv.appendChild(label);
    content.append(outerDiv, document.createElement('br'));
}

// Setting widget creators
let settingWidgetCreators = {
    note: (content, cfg, key, item) => {
        const note = document.createElement('div');
        note.className = 'bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded';
        note.textContent = item.display || '';
        content.append(note, document.createElement('br'));
    },
    bool: (content, cfg, key, item) => {
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.className = 'w-6 h-6 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500';
        input.checked = cfg(key);
        input.onchange = (e) => cfg(key, e.target.checked);
        createBaseElement(content, cfg, key, item, input);
    },
    option: (content, cfg, key, item) => {
        const select = document.createElement('select');
        select.className = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5';
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
        textarea.className = 'bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 h-24';
        textarea.value = cfg(key);
        textarea.onchange = (e) => cfg(key, e.target.value);
        createBaseElement(content, cfg, key, item, textarea);
    },
    image: (content, cfg, key, item) => {
        const container = document.createElement('div');
        container.className = 'flex flex-col space-y-2';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5';
        input.placeholder = 'Enter image link or choose file';
        input.value = cfg(key) || '';

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.className = 'block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none';

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
        input.className = 'bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5';
        input.placeholder = '#000000';
        input.value = cfg(key) || '';

        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.className = 'h-10 w-10 border-0 rounded';
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
        input.className = 'bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5';
        input.value = cfg(key);
        input.onchange = (e) => cfg(key, type === 'number' ? parseFloat(e.target.value) : e.target.value);
        createBaseElement(content, cfg, key, item, input);
    };
}

// Generate settings UI
function generateSettingsUI(root, props, cfg) {
    Object.entries(props).forEach(([key, item]) => {
        const content = root.querySelector(`#content-${item.category}-container`);
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