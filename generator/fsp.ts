import * as fs from 'fs';
export * from 'fs';
import * as mkdirpPackage from 'mkdirp';
import * as util from 'util';
import * as rimrafPackage from 'rimraf';

export const copyFile = util.promisify(fs.copyFile);
export const readFile = util.promisify(fs.readFile);
export const readdir = util.promisify(fs.readdir);
export const symlink = util.promisify(fs.symlink);
export const writeFile = util.promisify(fs.writeFile);
export const unlink = util.promisify(fs.unlink);
export const mkdirp = util.promisify(mkdirpPackage);
export const exists = util.promisify(fs.exists);
export const rmdir = util.promisify(fs.rmdir);
export const rimraf = util.promisify(rimrafPackage);
