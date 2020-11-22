import pptr from 'https://esm.sh/puppeteer-core/lib/esm/puppeteer/web.js'
import { readLines } from "https://deno.land/std/io/mod.ts"

const p = await Deno.run({
  cmd: [
    '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome',
    // '--headless',
    '--remote-debugging-port=8964',
    '--user-data-dir=/tmp/pptr/user-data',
    'http://github.com',
  ],
  stdout: "piped",
  stderr: "piped",
})

// get the ws url from Chrome Output
async function logChromeOuput () {
  for await (const line of readLines(p.stderr)) {
    console.info('chrome output:', line);

    const i = line.indexOf('ws://')

    if (i > 0) {
      return line.slice(i)
    }
  }
}

const ws = await logChromeOuput()

console.log(ws)

if (ws) {
  const browser = pptr.connect({
    browserWSEndpoint: ws,
    ignoreHTTPSErrors: true
  })

  // do whatever you want
}
