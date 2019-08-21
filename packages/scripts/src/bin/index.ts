#!/usr/bin/env node
import program from 'commander'
import chalk from 'chalk'
import lint from '../tasks/lint'
import compile2es from '../tasks/compile2es'
import compile2lib from '../tasks/compile2lib'
import bundle from '../tasks/bundle'
import compileStyle from '../tasks/compileStyle'
import site from '../tasks/site';

const scripts = [
  {
    name: 'lint',
    script: lint,
    desc: 'Lint style'
  },
  {
    name: 'compile:style',
    script: compileStyle,
    desc: 'compile style files'
  },
  {
    name: 'compile:es',
    script: compile2es,
    desc: 'Compile script files with es6 format'
  },
  {
    name: 'compile:lib',
    script: compile2lib,
    desc: 'Compile script file with normal es5 format'
  },
  {
    name: 'compile',
    script: () => Promise.all([compile2es(), compile2lib(), compileStyle()]),
    desc: "run commands 'compile:es', 'compile:lib' and 'compile:style'"
  },
  {
    name: 'bundle',
    script: bundle,
    options: [
      {
        name: 'libraryName',
        required: false,
        desc: 'Specify library name, default name in package.json'
      },
      {
        name: 'entry',
        required: false,
        desc:
          'Specify entry name, default searching index in src root directory'
      },
      {
        name: 'style',
        required: false,
        desc:
          'Specify style entry name, default searching index in src/style root directory'
      }
    ]
  }, {
    name: 'site:dev',
    script: () => site({
      isProduction: false
    }),
    desc: 'run site dev'
  }, {
    name: 'site:build',
    script: () => site({
      isProduction: true
    }),
    desc: 'run site build'
  }
]

program.version(require('../../package.json').version)

for (let script of scripts) {
  let exec = program.command(script.name).description(script.desc || '')
  for (const option of script.options || []) {
    exec = exec
      .option(
        `--${option.name} ${
        option.required ? `<${option.name}>` : `[${option.name}]`
        }`
      )
      .description(option.desc || '')
  }
  exec.action(async function (options) {
    const start = Date.now()
    console.log(chalk.green(`task '${script.name}' is started`))
    try {
      await script.script(options)
      console.log(
        chalk.green(
          `task '${script.name}' is finished: ${Date.now() - start} ms`
        )
      )
    } catch (e) {
      console.error(chalk.red(`task '${script.name}' is finished with error:`))
      console.error(e)
    }
  })
}

program.parse(process.argv)
