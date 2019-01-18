import * as handlebars from 'handlebars';
import * as path from 'path';

import {loadContributorFromConfiguration} from './contributors.js';
import {InMemoryRepresentationOfGuideMetadata, LearningPath, PathTopic, RootCards, SerializedGuideJson, TopLevelFile} from './file-types.js';
import * as fs from './fsp.js';
import {markdown} from './markdown.js';

const TEMPLATE_DIRECTORY = path.resolve(__dirname, '..', '..', 'templates');

function readTemplate(templateName: string) {
  return handlebars.compile(fs.readFileSync(
      path.resolve(TEMPLATE_DIRECTORY, `${templateName}.html`), 'utf8'));
}

const PATH_TEMPLATE = readTemplate('path');
const DEVSITE_TEMPLATE = readTemplate('devsite');
const ROOT_CARDS_TEMPLATE = readTemplate('root-cards');
const GUIDE_TEMPLATE = readTemplate('guide');
const CODELAB_TEMPLATE = readTemplate('glitch');

export async function writeTopLevelFile(directory: string, file: TopLevelFile) {
  await fs.writeFile(path.resolve(directory, file.name), file.body);
}

async function writeSingleGuide(
    directory: string, learningPath: LearningPath, topic: PathTopic,
    guide: InMemoryRepresentationOfGuideMetadata) {
  const guideDirectory = path.resolve(directory, guide.name);

  const main = markdown(guide.body);
  const {title, attributes: {description}} = guide;

  const body = GUIDE_TEMPLATE({
    main,
    learningPath,
    topic,
    author: await loadContributorFromConfiguration(guide.attributes.author),
    ...guide
  });

  await fs.mkdirp(guideDirectory);
  await fs.writeFile(
      path.resolve(guideDirectory, 'index.html'),
      DEVSITE_TEMPLATE({title, meta: {description}, body}));

  for (const artifact of guide.artifacts) {
    await fs.copyFile(
        artifact.source,
        path.resolve(directory, guide.name, artifact.fileName));
  }

  for (const codelab of guide.codelabs) {
    const {title, description, glitch} = codelab.attributes;
    const codeLabBody = CODELAB_TEMPLATE(
        {main: markdown(codelab.body), glitch, title, relatedGuide: guide});

    await fs.writeFile(
        path.resolve(guideDirectory, codelab.name + '.html'),
        DEVSITE_TEMPLATE({title, meta: {description}, body: codeLabBody}));
  }
}

export async function writeLearningPath(directory: string, file: LearningPath) {
  const {name, title, description} = file;

  await fs.writeFile(
      path.resolve(directory, name + '.html'),
      DEVSITE_TEMPLATE(
          {title, meta: {description}, body: PATH_TEMPLATE(file)}));

  const contentDirectoryName = path.resolve(directory, name);
  await fs.mkdirp(contentDirectoryName);

  for (const topic of file.topics) {
    for (const guide of topic.guides) {
      await writeSingleGuide(contentDirectoryName, file, topic, guide);
    }
  }
}

export async function writeRootCards(directory: string, cards: RootCards) {
  await fs.writeFile(
      path.resolve(directory, '_root-cards.html'), ROOT_CARDS_TEMPLATE(cards));
}

export async function writeSerializedGuideJson(
    directory: string, allGuides: SerializedGuideJson[]) {
  await fs.writeFile(
      path.resolve(directory, '_guides-json.html'),
      JSON.stringify({guides: allGuides}));
}
