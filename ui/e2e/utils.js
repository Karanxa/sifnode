// utils.js
import StreamZip from "node-stream-zip";
import axios from "axios";
import fs from "fs";
import path from "path";
import { KEPLR_CONFIG, MM_CONFIG } from "./config";
const { chromium } = require("playwright");

// Not in use, don't have good place to get the extension zips, for now
export async function downloadFile(name, url, dir) {
  const write = path.resolve(dir, `${name}.zip`);
  const writer = fs.createWriteStream(write);

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

export async function extractFile(downloadedFile, extractDestination) {
  const zip = new StreamZip.async({ file: downloadedFile });
  if (!fs.existsSync(extractDestination)) {
    fs.mkdirSync(extractDestination);
  }
  await zip.extract(null, extractDestination);
}

export async function extractExtensionPackage(extensionId) {
  await extractFile(`downloads/${extensionId}.zip`, "./extensions");
  return;
}

export async function getExtensionPage(extensionId) {
  // export async function getExtensionPage(browserContext, extensionId) {
  const pages = await context.pages();
  // pages.forEach((page) => console.log('pageUrl=', page.url()))
  const foundPages = pages.filter((page) =>
    page.url().match(`chrome-extension://${extensionId}`),
  );

  if (foundPages.length > 0) return foundPages[0];
  else return undefined;
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
