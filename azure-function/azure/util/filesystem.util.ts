const fs = require("fs");
const fsE = require("fs-extra");

export function writeJsonFile(
  directory: string,
  filename: string,
  jsonData: string
): boolean {
  ensureDirectoryExists(directory);

  fs.writeFileSync(
    `${directory}/${filename}`,
    jsonData,
    function (err: any): boolean {
      if (err) {
        console.log(err);
        return false;
      }

      return true;
    }
  );

  return true;
}

export function ensureDirectoryExists(filePath: string) {
  if (fs.existsSync(filePath)) {
    return true;
  }

  fs.mkdirSync(filePath, { recursive: true }, (err: any) => {
    if (err) throw err;
  });
}

export function renameJsonFile(
  directory: string,
  filename: string,
  newFilename: string
): boolean {
  ensureDirectoryExists(directory);

  try {
    fs.readFileSync(`${directory}/${filename}`);
  } catch (error) {
    fs.writeFileSync(`${directory}/${filename}`, "[]", { flag: "wx" });
  }

  fs.renameSync(
    `${directory}/${filename}`,
    `${directory}/${newFilename}`,
    function () {
      return false;
    }
  );

  return true;
}

export function readJsonFile(directory: string, filename: string): any {
  return readJsonFileFromPath(`${directory}/${filename}`);
}

export function readJsonFileFromPath(filePath: string): any {
  const file = fsE.readJsonSync(filePath, { throws: false });
  return file ?? [];
}
