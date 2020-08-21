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

/**
 * @fileoverview Command-line script to delete old versions of a deployed App Engine project.
 */

// Sample project information looks like:
// {
//   environment: { name: 'STANDARD', value: 1 },
//   id: 'ff880647dafd6b7bb602e85e08ec7c28836d228c',
//   last_deployed_time: {
//     datetime: '2020-06-23 07:52:08+10:00',
//     day: 23,
//     hour: 7,
//     microsecond: 0,
//     minute: 52,
//     month: 6,
//     second: 8,
//     year: 2020
//   },
//   project: 'web-dev-staging',
//   service: 'default',
//   traffic_split: 0,
//   version: {
//     createTime: '2020-06-22T21:52:08Z',
//     createdBy: 'deployer@web-dev-production-1.iam.gserviceaccount.com',
//     diskUsageBytes: '222606525',
//     env: 'standard',
//     id: 'ff880647dafd6b7bb602e85e08ec7c28836d228c',
//     instanceClass: 'F1',
//     name: 'apps/web-dev-staging/services/default/versions/ff880647dafd6b7bb602e85e08ec7c28836d228c',
//     network: {},
//     runtime: 'nodejs12',
//     runtimeChannel: 'default',
//     servingStatus: 'SERVING',
//     threadsafe: true,
//     versionUrl: 'https://ff880647dafd6b7bb602e85e08ec7c28836d228c-dot-web-dev-staging.appspot.com'
//   }
// }

const keepMinimumRecentVersions = 20;
const keepVersionsForDays = 7;
const deleteAtMost = 4; // deleting is slow

const log = require('fancy-log');
const childProcess = require('child_process');
const prettyMs = require('pretty-ms');

const project = process.argv[2] || 'web-dev-staging';
const now = new Date();

purgeOldVersionsFor(project);

/**
 * Retrieve parsed information for all deployed versions.
 *
 * @param {string} project
 * @return {!Array<!Object>}
 */
function fetchVersions(project) {
  const {status, stdout} = childProcess.spawnSync(
    'gcloud',
    ['app', '--project', project, 'versions', 'list', '--format="json"'],
    {
      input: '',
      timeout: 20 * 1000,
    },
  );
  if (status !== 0) {
    throw new Error(`could not list versions: ${status}`);
  }
  return JSON.parse(stdout);
}

/**
 * Deletes a number of versions from a project.
 *
 * @param {string} project
 * @param {!Array<string>} versions
 * @param {string=} service defaults to "default"
 * @return {!Array<!Object>}
 */
function deleteVersions(project, versions, service = 'default') {
  versions.forEach((version) => {
    if (
      typeof version !== 'string' ||
      version.startsWith('-') ||
      version.includes('\\')
    ) {
      // Check for some possibly badly formatted names, including -, prevent flags from being set.
      throw new Error(`bad version: ${version}`);
    }
  });

  // Deleting versions is slow, so do a chunk at a time.
  let done = 0;
  versions = versions.slice();
  while (versions.length) {
    const next = versions.splice(0, deleteAtMost);
    log('Enacting deletion for versions:', next.join(' '));

    const {status, stdout} = childProcess.spawnSync(
      'gcloud',
      [
        'app',
        '--project',
        project,
        'versions',
        'delete',
        ...next,
        '--service',
        service,
        '--format="json"',
      ],
      {
        input: '',
        timeout: 60 * 1000,
      },
    );
    if (status !== 0) {
      log('Could not delete versions:', status);
      break;
    }
    done += versions.length;
    console.info(JSON.parse(stdout));
  }
  return done;
}

/**
 * Purges old versions for the passed project.
 *
 * @param {string} project
 * @param {string=} service
 */
function purgeOldVersionsFor(project, service = 'default') {
  let candidates = [];
  const versions = fetchVersions(project);

  for (const v of versions) {
    if (
      v.project !== project ||
      v.service !== service ||
      v.traffic_split !== 0.0
    ) {
      // Filter unexpected results or anything serving traffic.
      continue;
    }

    // Parse Date so we can easily sort.
    const lastDeployed = new Date(v.last_deployed_time.datetime);
    candidates.push({
      id: v.id,
      usage: parseInt(v.version.diskUsageBytes) || 0,
      lastDeployed,
    });
  }

  // Place most recent versions first.
  candidates.sort(({lastDeployed: a}, {lastDeployed: b}) => b - a);

  // Keep the most recent version for the last `keepVersionForDays` days.
  const versionsForDays = new Map();
  for (let i = 0; i < keepVersionsForDays; ++i) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    versionsForDays.set(d.toISOString().substr(0, 10), null);
  }

  // Keep the most recent `keepMinimumRecentVersions` versions.
  const keptRecentVersions = [];

  candidates = candidates.filter(({id, lastDeployed}) => {
    const since = +now - +lastDeployed;
    const deployedString = `deployed ${prettyMs(since)} ago`;

    const key = lastDeployed.toISOString().substr(0, 10);
    if (versionsForDays.has(key) && versionsForDays.get(key) === null) {
      log('Keeping', id, 'for date', key, deployedString);
      versionsForDays.set(key, id);
      return false; // safe from deletion
    }

    if (keptRecentVersions.length < keepMinimumRecentVersions) {
      log('Keeping', id, 'within recent count', deployedString);
      keptRecentVersions.push(id);
      return false; // safe from deletion
    }

    log('Deleting', id, deployedString);
    return true;
  });

  const count = deleteVersions(
    project,
    candidates.map(({id}) => id),
    service,
  );

  // If deletions were requested but none completed, fail.
  if (candidates.length && count === 0) {
    throw new Error(`Deleted ${count} versions with error`);
  }

  log('Done, deleted', count, 'versions');
}
