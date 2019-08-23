#!/usr/bin/env node
import program from 'commander'
import chalk from 'chalk'
import lint from '../tasks/lint'
import compile2es from '../tasks/compile2es'
import compile2lib from '../tasks/compile2lib'
import bundle from '../tasks/bundle'
import compile2Css from '../tasks/compile2Css'
import site from '../tasks/site';

const scripts = [
  {
    name: 'lint',
    script: lint,
    desc: 'Lint style'
  },
  {
    name: 'compile:style',
    script: compile2Css,
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
    script: () => Promise.all([compile2es(), compile2lib(), compile2Css()]),
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
      }
    ]
  }, {
    name: 'site:dev',
    script: (options: any) => site({
      ...options,
      isProduction: false
    }),
    desc: 'run site dev',
    options: [{
      name: 'port',
      desc: "Specify server port, default is 3000"
    }]
  }, {
    name: 'site:build',
    script: (options: any) => site({
      ...options,
      isProduction: true,
    }),
    desc: 'run site build',
    options: [{
      name: 'publicPath',
      desc: "Specify docs public path in production mode, default '/'"
    }]
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
    console.info(chalk.green(`task '${script.name}' is started`))
    try {
      await script.script(options)
      console.info(
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
