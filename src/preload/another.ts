import { readFile } from 'fs-extra'

/**
 * You can access node module here!
 */
export async function readSomeFile() {
  console.log('You can use module module in preload no matter the nodeIntegration!')
  return readFile('/abc')
}
