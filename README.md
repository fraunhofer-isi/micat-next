<!--
© 2024 Fraunhofer-Gesellschaft e.V., München

SPDX-License-Identifier: AGPL-3.0-or-later
-->

# MICAT
[**MICAT**](https://micatool.eu) – **M**ultiple **I**mpacts **C**alculation **T**ool – is a project that develops a comprehensive approach to estimate Multiple Impacts of Energy Efficiency (MI-EE) by co-creating a free, easy-to-use, scientifically sound online tool.

For more **open source** software provided by [**Fraunhofer ISI**](https://www.isi.fraunhofer.de/) see https://github.com/fraunhofer-isi.

## Documentation

* Online: https://fraunhofer-isi.github.io/micat

* As *.pdf: https://fraunhofer-isi.github.io/micat/latex/micat.pdf

* Project: https://micatool.eu

## micat-next

This project contains a **!!deprecated!!** front-end for MICAT, based on [next.js](https://nextjs.org/).
For the current version of the front-end see [micat-vue](https://github.com/fraunhofer-isi/micat-vue).
For the back-end see [micat](https://github.com/fraunhofer-isi/micat).

Deprecated demo page:
https://fraunhofer-isi.github.io/micat-next/

## Licenses

This project is free and open source software:

* It is licensed under the GNU Affero General Public License v3 or later (AGPLv3+) - see [LICENSE.md](./LICENSE.md).
* It uses third-party open source modules, see [package.jsonl](./package.json) and [THIRDPARTY.md](./THIRDPARTY.md).

## Badges

Click on some badge to navigate to the corresponding **quality assurance** workflow:

### Formatting & linting

[![lint](https://github.com/fraunhofer-isi/micat-next/actions/workflows/lint.yml/badge.svg)](https://github.com/fraunhofer-isi/micat-next/actions/workflows/lint.yml) Checks code formatting with [ESlint](https://eslint.org/)

### Test coverage

[![coverage](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/fhg-isi/4bb6f7ce335564341b0181db14bdc98f/raw/micat-next_coverage.json)](https://github.com/fraunhofer-isi/micat-next/actions/workflows/coverage.yml) Determines test coverage with [jest](https://jestjs.io/)

### License compliance

[![license_check](https://github.com/fraunhofer-isi/micat-next/actions/workflows/license_check.yml/badge.svg)](https://github.com/fraunhofer-isi/micat-next/actions/workflows/license_check.yml) Checks license compatibility with [license-checker](https://github.com/davglass/license-checker)

[![reuse_annotate](https://github.com/fraunhofer-isi/micat-next/actions/workflows/reuse_annotate.yml/badge.svg)](https://github.com/fraunhofer-isi/micat-next/actions/workflows/reuse_annotate.yml) Creates copyright & license annotations with [reuse](https://git.fsfe.org/reuse/tool)

[![reuse compliance](https://api.reuse.software/badge/github.com/fraunhofer-isi/micat-next)](https://api.reuse.software/info/github.com/fraunhofer-isi/micat-next) Checks for REUSE compliance with [reuse](https://git.fsfe.org/reuse/tool)

### Dependency updates & security checks

[![renovate](https://github.com/fraunhofer-isi/micat-next/actions/workflows/renovate.yml/badge.svg)](https://github.com/fraunhofer-isi/micat-next/actions/workflows/renovate.yml) Updates dependencies with [renovate](https://github.com/renovatebot/renovate)

[![CodeQL](https://github.com/fraunhofer-isi/micat-next/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/fraunhofer-isi/micat-next/actions/workflows/github-code-scanning/codeql) Discovers vulnerabilities with [CodeQL](https://codeql.github.com/)

## Configuration

This project can be configured to some extend. For this purpose two
files are important:

* `.settings.default.json` - The default settings: This
file is under version control and should not be changed unless there is
a good reason for it.

* `.settings.json` - The user-defined settings: If this
file exists, the corresponding settings are preferred. This file
is __not__ under version control and is already contained in the 
`.gitignore` file so that the file remains locally and does not
affect or overwrite the default configuration in 
`.settings.default.json`. To override the default settings, the 
`.settings.json` file has to be created manually by copying the file
`.settings.default.json` and renaming it afterwards to `.settings.json`.
Then the preferences in `.settings.json` can be changed based on the
developer's needs:

* `frontEnd->apiCalls->useLocalApi`: If you want to use a local version 
of the back_end running on localhost, set the value to `true`. If
set to `false` micat-next will use the remote back_end on our server.

* `frontEnd->useDefaultSavings`: If set to `true`, the energy
savings table is loaded with default data that can be specified in 
`frontEnd->defaultSavings`. If `false`, the data has to be filled
manually.

* `frontEnd->defaultSavings`: A 2D array that acts as default
data for the energy savings table. The data is validated to a certain
extent but always check twice. 

* `frontEnd->useDefaultRegion`: If set to `true`, the value of the "Region"
selector is set to the default value specified in `frontEnd->defaultRegion`.

* `frontEnd->defaultRegion`: A default region value, which can be specified
in order to be pre-selected in the region selector. If the
value is invalid, the default value is not used. For a list of valid regions,
expand the "Region" selector.

## Usage

### Ensure that an instance of the back_end is running

micat-next requires the back_end API to be up and running, 
for example at:

http://micatool-dev.eu/

(That is because at "build time" ... some data
is requested from the back_end, also see function "getStaticProps" in
`src/pages/[id_region]/index.js`). If you want to use a local version
of the back_end see the chapter `Configuration`.


### Install dependencies

* Install dependencies with node package manager:

`npm install`


### Start 

* Run next.js application in development mode:

`npm run dev`   

* Open Google Chrome and go to following url:

`http://localhost:3000/micat-next`

### Automate start of front_end

The start can for example be automated with a "Before launch" entry of the 
PyCharm run configuration, also see README.md of the back_end.

## Debugging

### Debugging dynamic code with Google Chrome

* Open Google Chrome developer tools (F12)

* Drag and drop micat-next folder to Google Chrome developer tools:
that way you will be able to edit code files within Google Chrome Dev Tools

* You can use the developer tools to debug the web application

### Debugging static code with Google Chrome

* Debugging static or "server side" parts of the code is tricky. Open the url:

`chrome://inspect`

and follow the "inspect" link. Also see
https://stackoverflow.com/questions/63650473/how-to-debug-getstaticprops-and-getstaticpaths-in-next-js

Setting break points in the original files might not work. Instead,
search for the file with Ctrl+P and look out for files starting with

`webpack-internal:///src/pages/`

=> Setting break points in that "compiled files" will do the trick. 

## Notes

<p><a href="https://www.isi.fraunhofer.de/en/publishing-notes.html">PUBLISHING NOTES</a></p>
