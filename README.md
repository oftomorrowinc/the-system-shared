# The System Shared
Shared files for internal project The System.


## Releasing a new package version
- Increment the version number in package.json as appropriate
- Run `npm run build` to ensure there are no errors
- Run `npm run release`
- Go to the project page on Github, go to releases, click draft a new release, select your tag, add a title/description and click publish
- In client and server, update the dependency to the latest version number in package.json and run `npm install git+https://github.com/oftomorrowinc/the-system-shared.git#v{version.number}`


Copyright 2025 Of Tomorrow, Inc. All Rights Reserved.