import * as core from '@actions/core'
import {getVersion} from './getVersion'
import {parsePrelease} from './parsePrelease'

async function run(): Promise<void> {
  try {
    const path: string = core.getInput('path')
    const filename: string = core.getInput('filename')
    const field: string = core.getInput('field')
    const version = getVersion(path, filename, field)

    core.debug(`read path: ${path}`)
    core.debug(`read filename: ${filename}`)
    core.debug(`read field: ${field}`)

    core.setOutput('current_version', version)

    const useCurrentVersion = core.getInput('use_current_version')
    const sermverString = core.getInput('semver_string')
    const sermverPattern = core.getInput('semver_pattern') ?? '^v?(.*)$'
    const regex = new RegExp(sermverPattern, 'g')
    const matches = regex.exec(sermverString)

    if (matches === null && !useCurrentVersion) {
      return core.setFailed(
        `[Error]: No matches found when using regex "${sermverPattern}"`
      )
    }

    if (matches || useCurrentVersion) {
      const res = parsePrelease(
        matches ? matches[1] : null,
        useCurrentVersion ? version : null
      )

      core.setOutput('pre_release_type', res.pre_release_type)
      core.setOutput('pre_release_name', res.pre_release_name)
      core.setOutput('full', res.full)
      core.setOutput('major', res.major)
      core.setOutput('minor', res.minor)
      core.setOutput('patch', res.patch)
      core.setOutput(
        'prerelease',
        res.prerelease ? res.prerelease.join('.') : ''
      )
      core.setOutput('build', res.build ? res.build.join('.') : '')
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
