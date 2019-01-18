import * as path from 'path';

import * as fs from './fsp.js';

/**
 * A filepath relative to the `content` directory, including the language.
 */
export type FilePath = string&{__type: 'file-path'};

/**
 * The name of a specific file (e.g. `path.basename(FilePath)`).
 */
export type FileName = string&{__type: 'file-name'};

/**
 * The representation of a Directory as `fs.Dirent`, but it's name is a
 * `FileName`.
 */
export type DirectoryName = fs.Dirent&{name: FileName};

/**
 * Typed version of `path.resolve()` that makes sure `FilePath`s are constructed
 * in the correct way.
 */
export function resolvePath(
    directoryPath: FilePath, ...fileName: string[]): FilePath {
  return path.resolve(directoryPath, ...fileName) as FilePath;
}

/**
 * Typed version of `path.basename()` that makes sure a `FileName` is correctly
 * obtained from a `FilePath` or `FileName`.
 */
export function basenamePath(fileName: FileName|FilePath): FileName {
  return path.basename(fileName) as FileName;
}

/**
 * Typed version of `fs.readdir()` that makes sure (if `withFileTypes: true`),
 * the directory objects have the proper `name: FileName`.
 */
export async function readdir(filePath: FilePath): Promise<FileName[]>;
export async function readdir(
    filePath: FilePath,
    options: {withFileTypes: true}): Promise<DirectoryName[]>;
export async function readdir(
    filePath: FilePath, options?: {withFileTypes: true}):
    Promise<FileName[]|Array<{name: FileName}>> {
  if (options) {
    return fs.readdir(filePath, options) as unknown as Promise<DirectoryName[]>;
  }

  return fs.readdir(filePath) as unknown as Promise<FileName[]>;
}

export interface Metadata {
  readonly page_type: string;
  readonly title: string;
  readonly author: string;
  readonly description: string;
  readonly web_updated_on: Date;
  readonly web_published_on: Date;
  readonly wf_blink_components: string;
}

export interface GuideMetadata extends Metadata {
  readonly web_lighthouse: string[];
}

export interface CodelabMetadata extends Metadata {
  readonly glitch: string;
}

export interface HTMLFileWithMetadata<M extends Metadata> {
  readonly attributes: M;
  readonly name: FileName;
  readonly body: string;
}

export interface GuideArtifact {
  readonly source: string;
  readonly fileName: FileName;
}

export interface PathTopicConfiguration {
  title: string;
  guides: string[];
}

export interface LearningPathConfiguration {
  readonly title: string;
  readonly description: string;
  readonly overview: string;
  readonly topics: PathTopicConfiguration[];
  readonly order: number;
}

export interface PathTopic {
  title: string;
  guides: InMemoryRepresentationOfGuideMetadata[];
  id: string;
}

export interface LearningPath {
  readonly name: string;
  readonly title: string;
  readonly description: string;
  readonly overview: string;
  readonly topics: PathTopic[];
  readonly order: number;
}

export interface InMemoryRepresentationOfGuideMetadata extends
    HTMLFileWithMetadata<GuideMetadata> {
  readonly codelabs: Array<HTMLFileWithMetadata<CodelabMetadata>>;
  readonly artifacts: GuideArtifact[];
  readonly href: string;
  readonly title: string;
  next?: InMemoryRepresentationOfGuideMetadata|PathTopic;
}

export interface TopLevelFile {
  readonly name: string;
  readonly body: string;
}

export interface ImagesDirectory {
  readonly name: string;
}

export interface RootCards {
  readonly paths: Array<LearningPath&{href: string}>;
}

export interface SerializedGuideJson {
  readonly topic: string;
  readonly path: string;
  readonly id: string;
  readonly lighthouse: string[];
  readonly title: string;
  readonly url: string;
}

export type FileData = LearningPath|TopLevelFile|ImagesDirectory;
