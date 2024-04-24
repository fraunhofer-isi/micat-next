// © 2024 Fraunhofer-Gesellschaft e.V., München
//
// SPDX-License-Identifier: AGPL-3.0-or-later

// This is the configuration ofr renovate but, referenced from
// github workflow .github/workflows/renovate.yml
// Also see
// https://github.com/renovatebot/github-action
// https://docs.renovatebot.com/self-hosted-configuration/

module.exports = {
  "username": "renovate-release",
  "gitAuthor": "Renovate Bot <bot@renovateapp.com>",
  "onboarding": false,
  "requireConfig": "optional",
  "platform": "github",
  "forkProcessing": "enabled",
  "dryRun": null, //"full",  // use full to only log messages instead of creating pull requests
  "autodiscover": true,
  "packageRules": [
    {
     "description": "lockFileMaintenance",
     "matchUpdateTypes": [
       "pin",
       "digest",
       "patch",
       "minor",
       "major",
       "lockFileMaintenance"
     ],
     "automerge": true,
     "automergeType": "branch",
     "ignoreTests": true, // set to false if you want updates only to be installed if tests pass
     "dependencyDashboardApproval": false,
     "minimumReleaseAge": null
    },
    {
      // eslint 9 is not supported by some packages, yet, for example
      // https://github.com/typescript-eslint/typescript-eslint/issues/8211
      // https://github.com/eslint-recommended/eslint-config/issues/5
      "matchPackageNames": ["eslint"],
      "allowedVersions": "8.56.0"
    },
    {
      "matchPackageNames": ["eslint-plugin-n"],
      "allowedVersions": "16.6.2"
    },
    {
      // eslint-recommended/eslint-config@16.0.3 requires eslint-plugin-unicorn@"48.0.0"
      "matchPackageNames": ["eslint-plugin-unicorn"],
      "allowedVersions": "48.0.0"
    },
    {
      // eslint-recommended/eslint-config@16.0.3 requires  eslint-plugin-jsdoc@"^46.0.0"
      "matchPackageNames": ["eslint-plugin-jsdoc"],
      "allowedVersions": "46.9.1"
    }
  ]
};