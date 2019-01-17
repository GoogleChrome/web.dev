import * as handlebars from 'handlebars';
import * as path from 'path';

import {LearningPath, TopLevelFile} from './file-types.js';
import * as fs from './fsp.js';

const TEMPLATE_DIRECTORY = path.resolve(__dirname, '..', '..', 'templates');

function readTemplate(templateName: string) {
  return handlebars.compile(fs.readFileSync(
      path.resolve(TEMPLATE_DIRECTORY, `${templateName}.html`), 'utf8'));
}

const PATH_TEMPLATE = readTemplate('path');
const DEVSITE_TEMPLATE = readTemplate('devsite');

export async function writeTopLevelFile(directory: string, file: TopLevelFile) {
  await fs.writeFile(path.resolve(directory, file.name), file.body);
}

export async function writeLearningPath(directory: string, file: LearningPath) {
  const {name, title, description} = file;

  await fs.writeFile(
      path.resolve(directory, name + '.html'),
      DEVSITE_TEMPLATE(
          {title, meta: {description}, body: PATH_TEMPLATE(file)}));
}
