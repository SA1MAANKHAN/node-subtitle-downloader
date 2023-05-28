require('dotenv').config()
const argv = require('yargs').argv;
const { searchSubtitles, downloadSubFile, readFileNamesFromDir, getSubFile } = require("./handlers");

const dirPath = argv.dir;

(async () => {

    console.log("reading files...")

    // create list of file names
    const filesNames = await readFileNamesFromDir(dirPath)

    console.log(filesNames.length, " files found in dir")

    for await (let file of filesNames) {

        console.log("downloading subs for: ", file);

        // seach sub
        const [fileId, err] = await searchSubtitles(file);
        if (err || !fileId){
            console.log("Oops! Something went wrong. :(")
            console.log(err);
            return;
        }

        // download sub
        const [link, err2 ] = await getSubFile(fileId);
        if (err2 || !link) {
            console.log("Oops! Something went wrong. :(")
            console.log(err2);
            return;
        }
        console.log("Sub downloaded successfully")
        const fileSavePath = `${dirPath}/${file}`;
        console.log("saving sub at: ", fileSavePath)
        // save sub
        downloadSubFile(link, fileSavePath)

    }

    console.log("\nSub saved successfully! :)")

    process.exit(0)
})()

