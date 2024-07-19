import { readFileSync, writeFileSync } from 'fs';

const cssContent = readFileSync('./dist/main.css', 'utf8').replaceAll('`', '\\`').replaceAll('${', '\\${').trim();
const jsContent = readFileSync('./dist/main.js', 'utf8').trim();
const htmlContent = readFileSync('./dist/index.html', 'utf8').split('<!-- - split - -->')[1].replaceAll('`', '\\`').replaceAll('${', '\\${').trim();

const result = `<style>${cssContent}</style> \n ${htmlContent}`

const output = `
const openConfigPanel = () => {
    const container = document.createElement('div');
    const shadowRoot = container.attachShadow({ mode: 'open' });
    const root = document.createElement('div');

    root.innerHTML = \`${result}\`;
    
    shadowRoot.appendChild(root);
    document.body.appendChild(container);

    ((_root,_config,_cfg)=>{ try{${jsContent}} catch(e){ console.error(e) }})(root,config,cfg);
}
`

writeFileSync('./dist/output.js', output)
writeFileSync('./../lib/res/config.js', output)
