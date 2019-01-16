import * as path from 'path';

import {FileData} from './file-types.js';
import * as fs from './fsp.js';
import {readLearningPath, readTopLevelFile} from './readers.js';

const TOP_LEVEL_DIRECTORY = path.resolve(__dirname, '..', '..');
// const BUILD_OUTPUT = path.resolve(TOP_LEVEL_DIRECTORY, 'build_output');
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

const shouldPreserveFileForBuildOutput = (_file: FileData) => {
  return true;
};

async function writeBuildOutput(_files: FileData[]) {}

async function main() {
  const files = await readContentDirectory();
  console.log('[')
  for (const file of files) {
    console.log(JSON.stringify(file) + ',');
  }
  console.log(']')
  const filteredFiles = files.filter(shouldPreserveFileForBuildOutput);

  await writeBuildOutput(filteredFiles);
}

main().catch(e => {
  console.error(`Encountered an error: ${e}`);
  process.exit(-1);
});
