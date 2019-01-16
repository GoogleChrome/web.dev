import * as yamlFrontMatter from 'front-matter';
import * as path from 'path';

import {GuideHTMLFileWithMetadata, LearningPath, TopLevelFile} from './file-types.js';
import * as fs from './fsp.js';

export const readTopLevelFile = async(
    fileName: string, relativeFileName: string): Promise<TopLevelFile> => {
  return {name: relativeFileName, body: await fs.readFile(fileName, 'utf8')};
};

const REQUIRED_ATTRIBUTES = [
  'page_type', 'title', 'author', 'description', 'web_updated_on',
  'web_published_on'
];

const GUIDE_REQUIRED_ATTRIBUTES = [...REQUIRED_ATTRIBUTES, 'web_lighthouse'];
const CODELAB_REQUIRED_ATTRIBUTES = [...REQUIRED_ATTRIBUTES, 'glitch'];

const readYamlAndAssertAttributes =
    async (requiredAttributes: string[], fileName: string) => {
  const {attributes, body} =
      yamlFrontMatter(await fs.readFile(fileName, 'utf8'));

  for (const requiredAttribute of requiredAttributes) {
    if (!(requiredAttribute in attributes)) {
      throw new Error(`Required attribute "${
          requiredAttribute}" was not specified for "${fileName}"`);
    }
  }

  return {attributes, body};
};

const isCodelab = (fileName: string) => {
  return fileName.startsWith('codelab-') && fileName.endsWith('.md');
};

const readCodelab = async (codelabFile: string) => {
  const {attributes, body} = await readYamlAndAssertAttributes(
      CODELAB_REQUIRED_ATTRIBUTES, codelabFile);

  return {name: codelabFile, attributes, body};
};

const readGuide =
    async(guideName: string): Promise<GuideHTMLFileWithMetadata> => {
  const guideIndexPage = path.resolve(guideName, 'index.md');
  const {attributes, body} = await readYamlAndAssertAttributes(
      GUIDE_REQUIRED_ATTRIBUTES, guideIndexPage);

  if (attributes.web_lighthouse === 'N/A') {
    attributes.web_lighthouse = [];
  } else if (!(attributes.web_lighthouse instanceof Array)) {
    throw new Error(
        `Expected either an array or "N/A" for "web_lighthouse" in "${
            guideIndexPage}"`);
  }

  const guideContentFiles = await fs.readdir(guideName);
  const codelabFiles = guideContentFiles.filter(isCodelab);
  const artifacts =
      guideContentFiles.filter(file => !isCodelab(file) && file !== 'index.md');

  const codelabs = await Promise.all(codelabFiles.map(
      codelabFile => readCodelab(path.resolve(guideName, codelabFile))));

  return {name: guideName, attributes, body, codelabs, artifacts};
};

export const readLearningPath = async(
    directoryName: string, learningPathName: string): Promise<LearningPath> => {
  const guideFiles = await fs.readdir(directoryName, {withFileTypes: true});

  const guides = guideFiles.filter(file => file.isDirectory());

  return {
    name: learningPathName,
    guides: await Promise.all(
        guides.map(guide => readGuide(path.resolve(directoryName, guide.name))))
  };
};
