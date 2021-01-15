const FileType = require('file-type');
const exiftool = require("exiftool-vendored").exiftool;
const sharp = require('sharp');
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const sprite = require('ffmpeg-generate-video-preview')

// var filePath = "/Users/computerroom/Desktop/test_files/job_queue.json";
// var filePath = "/Users/computerroom/Desktop/test_files/WhatsApp Audio 2020-09-06 at 4.58.53 PM.mp4";
var filePath = "/Users/computerroom/Desktop/test_files/Mumay Smruty 3's.tif";
// var filePath = "/Users/computerroom/Desktop/test_files/test.jpg";
// var filePath = "/Users/computerroom/Desktop/test_files/World ending.mp4";
var thumbsPath = "/Users/computerroom/Desktop/test_files/thumbnail.jpg";
let thumbsFolder = "/Users/computerroom/Desktop/test_files/";
var spriteFolder = "/Users/computerroom/Desktop/test_files/";

// TESTING
(async () => {
    
    getFileType(filePath)
    .then(type => {
        var fileName = path.basename(filePath, path.extname(filePath));
        var thumbsPath = "/Users/computerroom/Desktop/test_files/thumbnail.jpg";

        if(type) {
            // console.log(type);
            switch (type) {
                case "image":
                    getPhotoThumbnail(filePath,thumbsPath);
                    break;
                case "video":
                    var thumbsPath = getVideoThumnail(filePath, thumbsFolder, fileName);
                    var thumbsPath = getVideoSprite(filePath, spriteFolder, fileName);
                    break;
                case "audio":
                    break;
            
                default:
                    break;
            }
        };
    });
    


})()



function getPhotoThumbnail(path, thumbsPath) {
    return new Promise((resolve,reject) => {
        try {
            // console.log(thumbsPath);
            sharp(path)
                .resize(160)
                .jpeg({
                    quality: 100
                })
                .toFile(thumbsPath, function(err) {
                    let output = JSON.stringify({status:"failed", error: err});
                    reject(output);
                    console.error("Thumbnail Generation Error: ", err);
                });
            // console.log(thumbsOutput);
            let output = JSON.stringify({status:"success"});
            resolve(output);
        } catch (e) {
            let output = JSON.stringify({status:"failed", error: e});
            reject(output);
        }
    })


}

function getVideoThumnail(path, thumbsFolder, fileName) {
    
    return new Promise((resolve,reject) => {
        try {

            // let thumbsPath = thumbsFolder + fileName + "_thumbs";

            ffmpeg(path)
                .screenshots({
                    count: 1,
                    filename: fileName + "_thumbs",
                    folder: thumbsFolder,
                    size: '160x160'
                });

            // console.log(metadata);

            let output = JSON.stringify({status:"success"});
            resolve(output);
        } catch(e) {
            let output = JSON.stringify({status:"failed", error: e});
            reject(output);
        }

    })
}

function getVideoSprite(path, spriteFolder, fileName) {
    
    return new Promise((resolve, reject) => {
        try {

            let spritePath = spriteFolder + fileName + 'sprite.jpg';

            const metadata = sprite({
                input: path,
                output: spritePath,
                width: 96,
                cols: 5,
                rows: 5
            })

            console.log(metadata);

            let output = JSON.stringify({status:"success"});
            resolve(output);
        } catch(e) {
            let output = JSON.stringify({status:"failed", error: e});
            reject(output);
        }
    })
}




// Get File Type Function
function getFileType(path) {
    
    return new Promise((resolve, reject) => {
        FileType.fromFile(path)
        .then(fileType => {
            // console.log(fileType);

            if(fileType) {
                let fileString = fileType.mime;
                let index = fileString.indexOf('/');
                if(index > -1) {
                    let type = fileString.substring(0,index).trim();
                    resolve(type);
                } else {
                    resolve(fileString);
                }
            } else {
                let output = JSON.stringify({status:"failed", error: e});
                reject(output);
            }
        });
    })

}