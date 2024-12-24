import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import { Icon } from './index';

const attributes = (element: Element): Icon.Attributes => {
  const attrs: Icon.Attributes = {};

  Array.from(element.attributes).forEach(({ name, value }) => {
    const attrName = name.replace(/-([a-z])/g, (_, char) => char.toUpperCase());

    if (['data-testid', 'style'].includes(name)) return;
    if (name === 'color' && value === 'currentColor') return;

    if (value) attrs[attrName] = value;
  });

  return attrs;
};

const element = (element: Element, keyPrefix: string = ''): Icon.Node => {
  const tagName = element.tagName.replace(/([A-Z])/g, (c) => c.toLowerCase());
  const attrs = attributes(element);
  const childrens = children(element, keyPrefix);
  return [tagName, { key: `${keyPrefix}-${tagName}`, ...attrs }, ...childrens];
};

const children = (e: Element, keyPrefix: string): Icon.Node[] => {
  return Array.from(e.children).map((child, index) => {
    const childKeyPrefix = `${keyPrefix}-${index}`;
    if (child.tagName === 'defs') {
      return [
        'defs',
        { key: `${childKeyPrefix}-defs`, ...attributes(e) },
        ...Array.from(child.children).map((childDef, defIndex) =>
          element(childDef, `${childKeyPrefix}-def-${defIndex}`)
        ),
      ];
    }
    return element(child, childKeyPrefix);
  });
};

export const parse = (content: string): Icon.Node[] => {
  const svg = new JSDOM(content).window.document.querySelector('svg')!;
  return children(svg, 'root');
};


const dirPath = './lib';

const icons = fs.readdirSync(dirPath)
  .filter((file) => file.endsWith('.svg'))
  .map((file) => ({
    name: path.basename(file, '.svg'),
    node: parse(fs.readFileSync(path.join(dirPath, file), 'utf-8')),
  }));

const output = `import { create } from './create';

${icons.map(({ name, node }) => `export const ${name} = create('${name}', ${JSON.stringify(node, null, 2)});`).join('\n')}

export const icons = {
  ${icons.map(({ name }) => name).join(',\n  ')}
};

export default icons;
`;

fs.writeFileSync('./compilation.tsx', output);
