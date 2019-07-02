import { join, sep, dirname } from 'path';
import { copyFile } from 'fs';
import { promisify } from 'util';

import chokidar from 'chokidar';
import mkdirp from 'mkdirp';

const copyFileP = promisify(copyFile);
const mkdirpP = promisify(mkdirp);

export default function copyFilesBuild(fromGlobs, toPath, { watch } = {}) {
  let readyPromise = Promise.resolve();

  async function copy(path) {
    const dest = join(toPath, ...path.split(sep).slice(1));
    await mkdirpP(dirname(dest));
    await copyFileP(path, dest);
  }

  function handleChange(path) {
    const copyDone = copy(path);
    readyPromise = readyPromise.then(() => copyDone);
  }

  return new Promise(resolve => {
    const watcher = chokidar.watch(fromGlobs);

    watcher.on('add', handleChange);
    watcher.on('change', handleChange);
    watcher.on('ready', () => {
      if (!watch) watcher.close();
      resolve(readyPromise);
    });
  });
}