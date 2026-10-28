import {cp,mkdir,readFile,writeFile,access} from 'node:fs/promises';
import {resolve} from 'node:path';
import {assets,events} from '../src/config.js';
const pages=['index.html','invite.html','bride.html','groom.html','builder.html','bride-invite-builder.html','groom-invite-builder.html'];
const referenced=[assets.garden,assets.envelope,assets.floral,assets.audio,assets.openingVideo,assets.heroVideo,assets.venuePhoto,assets.gurudwaraPhoto,...events.map(event=>event.image),...assets.gallery.map(p=>p.src)].filter(Boolean);
for(const asset of referenced){if(!asset.startsWith('assets/')||asset.includes('..'))throw new Error(`Use a relative assets/ path: ${asset}`);await access(asset);}
await mkdir('dist',{recursive:true});
for(const item of [...pages,'assets','src'])await cp(item,resolve('dist',item),{recursive:true});
await writeFile('dist/.nojekyll','');
for(const page of pages){const html=await readFile(resolve('dist',page),'utf8');if(/(?:href|src)="\//.test(html))throw new Error(`Root-relative URL in ${page}`);}
console.log(`Built ${pages.length} pages with relative asset paths in dist/.`);
console.log(`Client assets: audio ${assets.audio?'provided':'pending'}, venue photo ${assets.venuePhoto?'provided':'pending'}, gallery ${assets.gallery.length} photos.`);
