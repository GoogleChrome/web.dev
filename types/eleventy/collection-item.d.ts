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
    /**
     * The full path to the source input file (including the path to the input directory)
     */
    inputPath: string;
    /**
     * Mapped from the input file name, useful for permalinks. Read more about [`fileSlug`](https://www.11ty.dev/docs/data-eleventy-supplied/#fileslug).
     */
    fileSlug: string;
    /**
     * The full path to the output file to be written for this content
     */
    outputPath: string;
    /**
     * URL used to link to this piece of content.
     */
    url: string;
    /**
     * The resolved date used for sorting. Read more about [Content Dates](https://www.11ty.dev/docs/dates/).
     */
    date: Date;
    /**
     * All data for this piece of content (includes any data inherited from layouts)
     */
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
      /**
       * Tells Algolia not index this page.
       */
      disable_algolia?: boolean;
      /**
       * Hero image of page.
       */
      hero?: string;
      /**
       * Thumbnail image of page.
       */
      thumbnail?: string;
      /**
       * Tells search engines not to index page (this includes algolia)
       */
      noindex?: boolean;
      /**
       * When the post was last updated.
       */
      updated?: Date;
      /**
       * If post is a draft.
       */
      draft?: boolean;
    };
    /**
     * The rendered content of this template. This does not include layout wrappers.
     */
    templateContent: unknown;
    /**
     * @UNDOCUMENTED
     */
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
  }
}

// empty export to keep file a module
export {};
