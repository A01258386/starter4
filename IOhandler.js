/*
 * Project: Instagram-like photo app
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date:November, 2021
 * Author: Gokce Gokmen
 *
 */

const unzipper = require("unzipper"),
  fs = require("fs"),
  PNG = require("pngjs").PNG,
  path = require("path");

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
//unzip a file using unzipper,after files unzipped,console.log "Extraction operation complete"
const unzip = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(pathIn)
      .pipe(unzipper.Extract({ path: pathOut }))
      .on("close", () => {
        console.log("Extraction operation complete");
        resolve();
      });
  });
};
unzip('myfile.zip', './unzipped')

//create a function an array of file paths for all the png files
const readDir = (dir) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
        let arr = [];
        files.forEach((file) => {
          if (path.extname(file) === ".png") {
            arr.push(path.join(dir, file));  
            return arr;          
          }          
        });
        console.log(arr);

      }
    });
  });
};

readDir("./unzipped")




/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
console.log(readDir("./unzipped"));

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */

//create a function called grayScale takes pathIn and pathOut as arguments
//take array of file paths and save the modified pixel array to grayscled folder
const grayScale = (filePath, pathProcessed) => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(new PNG({ filterType: 4 }))
      .on("parsed", function () {
        for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x++) {
            let idx = (this.width * y + x) << 2;
            let avg = (this.data[idx] + this.data[idx + 1] + this.data[idx + 2]) / 3;
            this.data[idx] = avg;
            this.data[idx + 1] = avg;
            this.data[idx + 2] = avg;
          }
        }
        this.pack().pipe(fs.createWriteStream(pathProcessed));
        resolve();
      });
  });
};

grayScale("./unzipped", "./grayscaled");

module.exports = {
  unzip,
  readDir,
  grayScale,
};
