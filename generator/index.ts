import * as path from 'path';

import {FileData, RootCards} from './file-types.js';
import * as fs from './fsp.js';
import {readLearningPath, readTopLevelFile} from './readers.js';
import {writeLearningPath, writeRootCards, writeTopLevelFile} from './writers.js';

const TOP_LEVEL_DIRECTORY = path.resolve(__dirname, '..', '..');
const BUILD_OUTPUT = path.resolve(TOP_LEVEL_DIRECTORY, 'build_output', 'en');
const CONTENT = path.resolve(TOP_LEVEL_DIRECTORY, 'content');

async function readContentDirectory(): Promise<FileData[]> {
  const contentFilesOrDirectories =
      await fs.readdir(CONTENT, {withFileTypes: true});

  if (typeof contentFilesOrDirectories[0] === 'string') {
    throw new Error(`You need at least Node 10.10.0 for this script`);
  }

  return Promise.all(contentFilesOrDirectories.map(async (fileOrDirectory) => {
    const resolvedName = path.resolve(CONTENT, fileOrDirectory.name);

    if (fileOrDirectory.isDirectory()) {
      // Don't try to parse the images folder as a learning path
      if (await fs.exists(path.resolve(resolvedName, 'guides.yaml'))) {
        return readLearningPath(resolvedName, fileOrDirectory.name);
      }

      return {name: fileOrDirectory.name};
    }

    return readTopLevelFile(resolvedName, fileOrDirectory.name);
  }));
}

function shouldPreserveFileForBuildOutput(_file: FileData) {
  return true;
}

async function writeBuildOutput(files: FileData[]) {
  await fs.rimraf(BUILD_OUTPUT);
  await fs.mkdirp(BUILD_OUTPUT);

  const rootCards: RootCards = {paths: []};

  for (const file of files) {
    if ('body' in file) {
      await writeTopLevelFile(BUILD_OUTPUT, file);
    } else if ('topics' in file) {
      await writeLearningPath(BUILD_OUTPUT, file);
      rootCards.paths.push({...file, href: `/${file.name}`});
    }
  }

  rootCards.paths.sort((one, other) => one.order - other.order);

  await writeRootCards(BUILD_OUTPUT, rootCards);
}

async function main() {
  const files = await readContentDirectory();
  const filteredFiles = files.filter(shouldPreserveFileForBuildOutput);

  await writeBuildOutput(filteredFiles);
}

main().catch((e: Error) => {
  console.error(`Encountered an error: ${e.stack}`);
  console.error(e);
  process.exit(-1);
});
