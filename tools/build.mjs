import { cp, mkdir, readdir, stat } from 'node:fs/promises';
await mkdir('dist', {recursive:true});
for (const file of ['index.html','styles.css','src','assets']) await cp(file,`dist/${file}`,{recursive:true,filter: p => !p.endsWith('.png')});
async function size(dir) {let n=0; for(const e of await readdir(dir,{withFileTypes:true})) n += e.isDirectory() ? await size(`${dir}/${e.name}`) : (await stat(`${dir}/${e.name}`)).size; return n;}
console.log(`Static build ready: ${(await size('dist')/1024/1024).toFixed(2)} MB total.`);
