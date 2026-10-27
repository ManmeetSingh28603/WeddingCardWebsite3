import {mkdir,writeFile} from 'node:fs/promises';
const sampleRate=8000,samples=sampleRate*3,buffer=Buffer.alloc(44+samples*2);
buffer.write('RIFF');buffer.writeUInt32LE(buffer.length-8,4);buffer.write('WAVEfmt ',8);buffer.writeUInt32LE(16,16);buffer.writeUInt16LE(1,20);buffer.writeUInt16LE(1,22);buffer.writeUInt32LE(sampleRate,24);buffer.writeUInt32LE(sampleRate*2,28);buffer.writeUInt16LE(2,32);buffer.writeUInt16LE(16,34);buffer.write('data',36);buffer.writeUInt32LE(samples*2,40);
for(let i=0;i<samples;i++)buffer.writeInt16LE(Math.round(Math.sin(i/sampleRate*440*2*Math.PI)*100),44+i*2);
await mkdir('output/playwright',{recursive:true});await writeFile('output/playwright/qa-tone.wav',buffer);
console.log('Created quiet test tone; not included in the production build.');
