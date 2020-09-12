/*
 * Copyright 2020 Google LLC
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

declare global {
  export interface EleventyCollectionItem {
    template: {
      inputPath: string;
      inputDir: string;
      parsed: {
        root: string;
        dir: string;
        base: string;
        ext: string;
        name: string;
        extname: string;
        basename: string;
        dirname: string;
        stem: string;
        path: string;
        absolute: string;
        isAbsolute: boolean;
      };
      extraOutputSubdirectory: string;
      outputDir: string;
      _extensionMap: TODO;
      linters: TODO;
      transforms: TODO;
      plugins: TODO;
      templateData: TODO;
      paginationData: TODO;
      isVerbose: boolean;
      isDryRun: boolean;
      writeCount: number;
      skippedCount: number;
      wrapWithLayouts: boolean;
      fileSlug: TODO;
      fileSlugStr: string;
      filePathStem: string;
      _templateRender: TODO;
      inputContent: string;
      _config: TODO;
      frontMatter: {
        content: string;
        data: TODO;
        isEmpty: boolean;
        excerpt: string;
      };
      _layoutKey: string;
      _layout: TODO;
      dataCache: TODO;
      computedData: TODO;
    };
    inputPath: string;
    fileSlug: string;
    filePathStem: string;
    data: {
      authorsData: AuthorsData;
      resourceCSS: TODO;
      resourceJS: TODO;
      tagsData: TagsData;
      paths: TODO;
      countries: TODO;
      event: TODO;
      podcasts: TODO;
      postHost: TODO;
      postToPaths: TODO;
      site: TODO;
      pkg: TODO;
      lang: string;
      locale: string;
      home: TODO;
      layout: string;
      description: string;
      authors?: string[];
      tags: string[];
      show_banner: boolean;
      eleventyComputed: TODO;
      permalink: string;
      title: string;
      subhead: string;
      date: Date;
      thumbnail: string;
      alt: string;
      page: {
        date: Date;
        inputPath: string;
        fileSlug: string;
        filePathStem: string;
        url: string;
        outputPath: string;
      };
      collections: TODO;
      canonicalUrl: string;
    };
    date: Date;
    outputPath: string;
    url: string;
    templateContent: unknown;
  }
}

// empty export to keep file a module
export {};
