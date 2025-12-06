import {parse, SemVer} from 'semver'

export interface ParsedSemverInfo
  extends Partial<
    Pick<
      SemVer,
      'major' | 'minor' | 'patch' | 'prerelease' | 'build' | 'version'
    >
  > {
  full: string
  main: string
  pre_release_name: string
  pre_release_type: string
}

export const parsePrelease = (
  semverString?: string | null,
  currentVersion?: string | null
): ParsedSemverInfo => {
  let parsed: SemVer | null = null
  let preReleaseName = 'alpha.0'
  let preReleaseType = 'alpha'

  if (semverString) {
    parsed = parse(semverString)

    if (parsed && parsed.prerelease && parsed.prerelease.length) {
      preReleaseType = `${parsed.prerelease[0]}`
      preReleaseName = `${preReleaseType}.${
        typeof parsed.prerelease[1] === 'number' ? parsed.prerelease[1] : 0
      }`
    }
  } else if (semverString || currentVersion) {
    parsed = parse(currentVersion)

    if (parsed && parsed.prerelease && parsed.prerelease.length) {
      preReleaseType = `${parsed.prerelease[0]}`
      preReleaseName = `${preReleaseType}.${
        typeof parsed.prerelease[1] === 'number' ? parsed.prerelease[1] + 1 : 0
      }`
    }
  }

  return {
    full: parsed?.raw ?? '',
    major: parsed?.major,
    minor: parsed?.minor,
    patch: parsed?.patch,
    main: `${parsed?.major}.${parsed?.minor}.${parsed?.patch}`,
    prerelease: parsed?.prerelease,
    build: parsed?.build,
    pre_release_name: preReleaseName,
    pre_release_type: preReleaseType
  }
}
