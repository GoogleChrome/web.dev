/**
 * A filepath relative to the `content` directory, including the language.
 */
export type FilePath = string;

/**
 * The name of a specific file (e.g. `path.basename(FilePath)`).
 */
export type FileName = string;

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
  readonly fileName: string;
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
