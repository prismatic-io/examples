/**
 * Create test zip files
 *
 * This helper script creates three files:
 * 1. `small.zip` which contains 3 CSV files, each with 100 rows. (~8.7KB zipped, 24KB unzipped)
 * 2. `medium.zip` which contains 10 files, each with 100,000 rows. (~28MB zipped, 63MB unzipped)
 * 3. `large.zip` which contains 20 files, each with 1,000,000 rows. (~559MB zipped, 1.3GB unzipped)
 *
 * After creating these files, you can upload them to Amazon S3 to test the integration.
 */

const fs = require("fs");
const archiver = require("archiver");
const path = require("path");
const { Readable } = require("stream");

/**
 * Draws a progress bar in the console
 */
const drawProgressBar = (fileName, progress) => {
  const barWidth = 30;
  const filledWidth = Math.floor((progress * barWidth) / 100);
  const emptyWidth = barWidth - filledWidth;
  const progressBar = "█".repeat(filledWidth) + "▒".repeat(emptyWidth);
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(`${fileName}: [${progressBar}] ${progress}%`);
};

/**
 * Creates a readable stream that generates CSV rows on-the-fly
 */
function createCsvStream(fileIndex, numRows) {
  let rowIndex = 0;

  return new Readable({
    read() {
      if (rowIndex === 0) {
        // Push CSV header
        this.push("id,column1,column2,column3\n");
      }
      if (rowIndex < numRows) {
        const row = `${fileIndex + 1}_${rowIndex + 1},${Math.random()},${Math.random()},${Math.random()}\n`;
        this.push(row);
        rowIndex++;
      } else {
        // Signal end of stream
        this.push(null);
      }
    },
  });
}

async function createZipFile(size, numFiles, numRows) {
  console.log(
    `\nCreating ${size}.zip with ${numFiles} files, each with ${numRows} rows...`
  );
  const output = fs.createWriteStream(path.join(__dirname, `${size}.zip`));
  const archive = archiver("zip", {
    zlib: { level: 9 }, // Sets the compression level.
  });
  archive.pipe(output);
  drawProgressBar(`${size}.zip`, 0);

  for (let i = 0; i < numFiles; i++) {
    const filename = `${size}_${i + 1}.csv`;
    const csvStream = createCsvStream(i, numRows);

    // Wait for this file to be fully processed before moving to the next
    await new Promise((resolve) => {
      archive.once("entry", resolve);
      archive.append(csvStream, { name: filename });
    });
    archive.removeAllListeners("entry");
    drawProgressBar(`${size}.zip`, ((i + 1) * 100) / numFiles);
  }
  await archive.finalize();
}

async function main() {
  await createZipFile("small", 3, 100);
  await createZipFile("medium", 10, 100000);
  await createZipFile("large", 20, 1000000);
  console.log("\nAll files created successfully.");
}

main();
