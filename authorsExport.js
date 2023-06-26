/*
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const fetch = require('node-fetch');

const {exportFile} = require('./src/site/_utils/export-file');
const {generateImgixSrc} = require('./src/site/_includes/components/Img');
const authorsData = require('./src/site/_data/authorsData.json');

const run = async () => {
  const authors = yaml.load(
    fs.readFileSync('./src/site/_data/i18n/authors.yml', 'utf-8'),
  );
  for (const id in authorsData) {
    authorsData[id].name = authors[id].title.en;
    authorsData[id].description = authors[id].description.en;
    if (authorsData[id].image) {
      let image = await fetch(generateImgixSrc(authorsData[id].image));
      image = await image.buffer();
      const ext = authorsData[id].image.split('.').pop();
      authorsData[id].image = `image/authors/${id}.${ext}`;
      exportFile(null, image, path.join('authors', authorsData[id].image));
    }
  }
  fs.writeFileSync(
    './dist/_export/authors/authors.json',
    JSON.stringify(authorsData),
  );
};

run();
