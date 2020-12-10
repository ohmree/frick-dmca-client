import { extname } from 'path';
import crypto from 'crypto';

const getFiles = (bundle) => {
    const files = Object.values(bundle).filter((file) => file.type === 'chunk' ||
        (typeof file.type === 'string' ? file.type === 'asset' : file.isAsset));
    const result = {};
    for (const file of files) {
        const { fileName } = file;
        const extension = extname(fileName).substring(1);
        result[extension] = (result[extension] || []).concat(file);
    }
    return result;
};
const makeCspDirective = (files, hashAlgorithm, additionalCspDirectives) => {
    const jsHashes = (files.js || [])
        .filter((chunkOrAsset) => chunkOrAsset.type === 'chunk')
        .map((chunk) => {
        const hash = crypto.createHash(hashAlgorithm);
        hash.update(chunk.code);
        return hash.digest('base64');
    });
    const cssHashes = (files.css || [])
        .filter((chunkOrAsset) => chunkOrAsset.type === 'asset' && typeof chunkOrAsset.source === 'string')
        .map((asset) => {
        const hash = crypto.createHash(hashAlgorithm);
        hash.update(asset.source);
        return hash.digest('base64');
    });
    const scriptSrc = additionalCspDirectives['script-src'];
    const additionalScriptDirectives = typeof scriptSrc === 'string' ? scriptSrc : (scriptSrc || []).join(' ');
    const jsCsp = `script-src ${`${jsHashes
        .map((hash) => `${hashAlgorithm}-${hash}`)
        .join(' ')}`} ${additionalScriptDirectives};`;
    // The deletes are necessary because otherwise these directives appear again in the `other` clause.
    delete additionalCspDirectives['script-src'];
    const styleSrc = additionalCspDirectives['style-src'];
    const additionalStyleDirectives = typeof styleSrc === 'string' ? styleSrc : (styleSrc || []).join(' ');
    const cssCsp = `style-src ${`${cssHashes
        .map((hash) => `${hashAlgorithm}-${hash}`)
        .join(' ')}`} ${additionalStyleDirectives};`;
    delete additionalCspDirectives['style-src'];
    const otherCspDirectives = Object.keys(additionalCspDirectives).map((key) => {
        const otherSrc = additionalCspDirectives[key];
        return `${key} ${typeof otherSrc === 'string' ? otherSrc : (otherSrc || []).join(' ')};`;
    }).join(' ');
    const cspDirectives = {
        'http-equiv': `content-security-policy: ${jsCsp} ${cssCsp} ${otherCspDirectives}`
    };
    return cspDirectives;
};
const makeHtmlAttributes = (attributes) => {
    if (!attributes) {
        return '';
    }
    const keys = Object.keys(attributes);
    // eslint-disable-next-line no-param-reassign
    return keys.reduce((result, key) => (result += ` ${key}="${attributes[key]}"`), '');
};
const defaultTemplate = async ({ attributes, files, meta, publicPath, title, shouldHash, hashAlgorithm, additionalCspDirectives }) => {
    const scripts = (files.js || [])
        .map(({ fileName }) => {
        const attrs = makeHtmlAttributes(attributes.script);
        return `<script src="${publicPath}${fileName}"${attrs}></script>`;
    })
        .join('\n');
    const links = (files.css || [])
        .map(({ fileName }) => {
        const attrs = makeHtmlAttributes(attributes.link);
        return `<link href="${publicPath}${fileName}" rel="stylesheet"${attrs}>`;
    })
        .join('\n');
    const metas = meta
        .concat(shouldHash ? makeCspDirective(files, hashAlgorithm, additionalCspDirectives) : [])
        .map((input) => {
        const attrs = makeHtmlAttributes(input);
        return `<meta${attrs}>`;
    })
        .join('\n');
    return `
<!doctype html>
<html${makeHtmlAttributes(attributes.html)}>
  <head>
    ${metas}
    <title>${title}</title>
    ${links}
  </head>
  <body>
    ${scripts}
  </body>
</html>`;
};
const supportedFormats = ['es', 'esm', 'iife', 'umd'];
const supportedHashAlgorithms = crypto
    .getHashes()
    .filter((algo) => ['sha256', 'sha384', 'sha512'].includes(algo));
const defaults = {
    attributes: {
        link: null,
        html: { lang: 'en' },
        script: null
    },
    fileName: 'index.html',
    meta: [{ charset: 'utf-8' }],
    publicPath: '',
    template: defaultTemplate,
    title: 'Rollup Bundle',
    shouldHash: false,
    hashAlgorithm: 'sha256',
    additionalCspDirectives: {}
};
function html(opts = {}) {
    const { attributes, fileName, meta, publicPath, template, title, shouldHash, hashAlgorithm, additionalCspDirectives } = Object.assign(Object.assign({}, defaults), opts);
    return {
        name: 'html',
        async generateBundle(output, bundle) {
            if (!supportedFormats.includes(output.format) && !opts.template) {
                this.warn(`plugin-html: The output format '${output.format}' is not directly supported. A custom \`template\` is probably required. Supported formats include: ${supportedFormats.join(', ')}`);
            }
            if (shouldHash && !supportedHashAlgorithms.includes(hashAlgorithm)) {
                this.warn(`plugin-html: '${hashAlgorithm}' is not recognized as a valid hash algorithm. Supported algorithms include: ${supportedHashAlgorithms.join(', ')}`);
            }
            if (output.format === 'es') {
                attributes.script = Object.assign(Object.assign({}, attributes.script), { type: 'module' });
            }
            const files = getFiles(bundle);
            const source = await template({
                attributes,
                bundle,
                files,
                meta,
                publicPath,
                title,
                shouldHash,
                hashAlgorithm,
                additionalCspDirectives
            });
            const htmlFile = {
                type: 'asset',
                source,
                name: 'Rollup HTML Asset',
                fileName
            };
            this.emitFile(htmlFile);
        }
    };
}

export default html;
export { makeHtmlAttributes };
