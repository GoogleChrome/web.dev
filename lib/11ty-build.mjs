import {spawn} from 'child_process';

export default async function eleventyBuild({ watch } = {}) {
  const proc = spawn('eleventy', { stdio: 'inherit' });

  await new Promise(resolve => {
    proc.on('exit', code => {
      if (code !== 0) throw Error('Eleventy build failed');
      resolve();
    });
  });

  if (watch) {
    spawn('eleventy', ['--watch'], { stdio: 'inherit' });
    return;
  }
}