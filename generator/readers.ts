import * as yamlFrontMatter from 'front-matter';
import * as yaml from 'js-yaml';
import * as path from 'path';
import * as slug from 'slug';

import {InMemoryRepresentationOfGuideMetadata, LearningPath, LearningPathConfiguration, TopLevelFile} from './file-types.js';
import * as fs from './fsp.js';

const REQUIRED_ATTRIBUTES = [
  'page_type', 'title', 'author', 'description', 'web_updated_on',
  'web_published_on'
];

const GUIDE_REQUIRED_ATTRIBUTES = [...REQUIRED_ATTRIBUTES, 'web_lighthouse'];
const CODELAB_REQUIRED_ATTRIBUTES = [...REQUIRED_ATTRIBUTES, 'glitch'];
const GUIDE_CONFIGURATION_REQUIRED_ATTRIBUTES =
    ['title', 'description', 'overview', 'topics', 'order'];

async function readYamlAndAssertAttributes(
    requiredAttributes: string[], fileName: string) {
  const {attributes, body} =
      yamlFrontMatter(await fs.readFile(fileName, 'utf8'));

  for (const requiredAttribute of requiredAttributes) {
    if (!(requiredAttribute in attributes)) {
      throw new Error(`Required attribute "${
          requiredAttribute}" was not specified for "${fileName}"`);
    }
  }

  return {attributes, body};
}

function isCodelab(fileName: string) {
  return fileName.startsWith('codelab-') && fileName.endsWith('.md');
}

async function readCodelab(
    href: string, guideFileName: string, codelabFile: string) {
  const {attributes, body} = await readYamlAndAssertAttributes(
      CODELAB_REQUIRED_ATTRIBUTES,
      path.resolve(guideFileName, codelabFile + '.md'));

  return {name: codelabFile, attributes, href, body};
}

async function readGuide(directoryName: string, guideName: string):
    Promise<InMemoryRepresentationOfGuideMetadata> {
  const guideFileName = path.resolve(directoryName, guideName);
  const guideIndexPage = path.resolve(guideFileName, 'index.md');
  const {attributes, body} = await readYamlAndAssertAttributes(
      GUIDE_REQUIRED_ATTRIBUTES, guideIndexPage);

  if (attributes.web_lighthouse === 'N/A') {
    attributes.web_lighthouse = [];
  } else if (!(attributes.web_lighthouse instanceof Array)) {
    throw new Error(
        `Expected either an array or "N/A" for "web_lighthouse" in "${
            guideIndexPage}"`);
  }

  const guideContentFiles = await fs.readdir(guideFileName);
  const codelabFiles = guideContentFiles.filter(isCodelab);
  const artifacts =
      guideContentFiles.filter(file => !isCodelab(file) && file !== 'index.md')
          .map(artifact => ({
                 source: path.resolve(guideFileName, artifact),
                 fileName: artifact
               }));

  const href = `/${path.basename(directoryName)}/${guideName}`;

  const codelabs = await Promise.all(codelabFiles.map(codelabFile => {
    const codeLabName = path.basename(codelabFile, '.md');

    return readCodelab(`${href}/${codeLabName}`, guideFileName, codeLabName);
  }));

  return {
    name: guideName,
    href,
    title: attributes.title,
    attributes,
    body,
    codelabs,
    artifacts
  };
}

async function readLearningPathConfiguration(directoryName: string):
    Promise<LearningPathConfiguration> {
  const guideConfiguration = yaml.load(
      await fs.readFile(path.resolve(directoryName, 'guides.yaml'), 'utf8'));

  for (const requiredAttribute of GUIDE_CONFIGURATION_REQUIRED_ATTRIBUTES) {
    if (!(requiredAttribute in guideConfiguration)) {
      throw new Error(`Required attribute "${
          requiredAttribute}" was not specified for "guides.yaml" in "${
          directoryName}"`);
    }
  }

  return guideConfiguration;
}

export async function readLearningPath(
    directoryName: string, learningPathName: string): Promise<LearningPath> {
  const guideFiles = await fs.readdir(directoryName, {withFileTypes: true});

  const {title, description, overview, order, topics} =
      await readLearningPathConfiguration(directoryName);

  const guides: InMemoryRepresentationOfGuideMetadata[] = await Promise.all(
      guideFiles.filter(file => file.isDirectory())
          .map(guide => readGuide(directoryName, guide.name)));

  const learningPath: LearningPath =
      {title, description, overview, order, topics: [], name: learningPathName};

  for (let topicNumber = 0; topicNumber < topics.length; topicNumber++) {
    const {title, guides: stringGuides} = topics[topicNumber];
    const id = slug(title);

    const topicGuides: InMemoryRepresentationOfGuideMetadata[] = [];

    for (let guideNumber = 0; guideNumber < stringGuides.length;
         guideNumber++) {
      const guide = guides.find(
          guide => path.basename(guide.name) === stringGuides[guideNumber]);

      if (!guide) {
        throw new Error(`Could not find guide specified in "guides.yaml" of "${
            learningPathName}" with name "${stringGuides[guideNumber]}"`);
      }

      // Update the "next" of the previous guide to point to the current guide
      if (guideNumber > 0) {
        topicGuides[guideNumber - 1].next = guide;
      }

      topicGuides[guideNumber] = guide;
    }

    // The "next" of the last guide in a topic will be set to the new topic
    if (topicNumber > 0) {
      const previousTopic = learningPath.topics[topicNumber - 1];

      previousTopic.guides[previousTopic.guides.length - 1].next =
          topicGuides[0];
    }

    learningPath.topics.push({title, id, guides: topicGuides});
  }

  return learningPath;
}

export async function readTopLevelFile(
    fileName: string, relativeFileName: string): Promise<TopLevelFile> {
  return {name: relativeFileName, body: await fs.readFile(fileName, 'utf8')};
}
