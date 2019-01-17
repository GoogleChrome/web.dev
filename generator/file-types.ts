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
  readonly name: string;
  readonly body: string;
}

export interface GuideHTMLFileWithMetadata extends
    HTMLFileWithMetadata<GuideMetadata> {
  readonly codelabs: Array<HTMLFileWithMetadata<CodelabMetadata>>;
  readonly artifacts: string[];
  readonly href: string;
  readonly title: string;
}

export interface PathTopic {
  title: string;
  guides: GuideHTMLFileWithMetadata[];
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
