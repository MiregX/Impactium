import fs from 'fs';
import { IconNode } from 'lucide-react';
import path from 'path';
import { JSDOM } from 'jsdom';

const dir = path.join(__dirname, 'lib');

function parse(content: string): IconNode {
  const dom = new JSDOM(content);
  const nodes: IconNode = [];

  dom.window.document.querySelectorAll('*').forEach((element) => {
    const name = element.tagName
      .toLowerCase()
      .replace('clippath', 'clipPath')
      .replace('lineargradient', 'linearGradient')
      .replace('radialgradient', 'radialGradient')
      .replace('stroke-linejoin', 'strokeLinejoin') as IconNode[0][0];
    const attrs: Record<string, any> = {};

    Array.from(element.attributes).forEach((attr) => {
      if (['data-testid', 'style', 'stroke'].includes(attr.name)) return;

      if (attr.name === 'fill') {
        attrs.stroke = 'none';
        attrs.color = 'unset';
      }

      attrs[attr.name.replace(/-([a-z])/g, (_, char) => char.toUpperCase())] = attr.value;
    });

    if (!['html', 'body', 'head', 'svg'].includes(name)) {
      nodes.push([name, attrs]);
    }
  });

  return nodes;
}

const icons = fs.readdirSync(dir).map((file) => {
  const name = path.basename(file, '.svg');
  const content = fs.readFileSync(path.join(dir, file), 'utf-8');
  return {
    name,
    node: parse(content),
  };
});

fs.writeFileSync(
  './compilation.tsx',
  `import { createLucideIcon } from 'lucide-react';

${icons
  .map(({ name, node }) => `const ${name} = createLucideIcon('${name}', ${JSON.stringify(node)});`)
  .join('\n')}

const icons = {
  ${icons.map(({ name }) => name).join(',\n  ')}
};

export { icons };
export default icons;
`
);
