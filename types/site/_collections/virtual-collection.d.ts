/*
 * Copyright 2021 Google LLC
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
  export interface VirtualDataField {
    /**
     * When the first post was created.
     */
    date: Date;
    /**
     * Hero image of element.
     */
    hero?: string;
    /**
     * When the last post was last created.
     */
    updated?: Date;
  }

  export interface VirtualCollectionItem<
    DataField extends VirtualDataField,
    AdditionalData extends {}
  > extends AdditionalData {
    data: DataField;
    elements: EleventyCollectionItem[];
    href: string;
    key: string;
    url: string;
  }

  export interface VirtualDataExpandedField extends VirtualDataField {
    alt: string;
    subhead: string;
    title: string;
  }

  export interface VirtualCollectionExpandedItem<
    DataField extends VirtualDataExpandedField,
    AdditionalData extends {}
  > extends VirtualCollectionItem<DataField, AdditionalData> {
    description: string;
    title: string;
  }
}

// empty export to keep file a module
export {};
