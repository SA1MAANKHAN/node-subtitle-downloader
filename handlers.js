const { readdir, writeFileSync } = require('fs');
const path = require('path');

const axios = require('axios');

const { API_KEY } = require('./config');
const handlers = {};

handlers.searchSubtitles = async (query) => {

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://api.opensubtitles.com/api/v1/subtitles?query=${query}`,
        headers: {
            'Api-Key': API_KEY
        }
    };

    return new Promise((resolve => {
        axios.request(config)
            .then((response) => {
                resolve([response.data.data.length ? response.data.data[0].attributes.files[0].file_id : null, null]);
            })
            .catch((err) => {
                resolve([null, err.message]);
            });

    }))
}

handlers.getSubFile = async (fileId) => {
    let data = JSON.stringify({
        "file_id": fileId,
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.opensubtitles.com/api/v1/download',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Api-Key': API_KEY
        },
        data: data
    };

    return new Promise(resolve => {

        axios.request(config)
            .then((response) => {
                resolve([response.data.link, null]);
            })
            .catch((err) => {
                resolve([null, err.message]);
            });
    })

}

handlers.downloadSubFile = async (link, file) => {

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: link,
        headers: {
        }
    };

    return new Promise(resolve => {
        axios.request(config)
            .then((response) => {
                writeFileSync(`${file}.srt`, response.data)
                resolve([true, null])
            })
            .catch((err) => {
                resolve([false, err.message])
            });
    })

}

handlers.readFileNamesFromDir = async (directoryPath) => {
    return new Promise(res => {
        readdir(directoryPath, (err, files) => {
            if (err) {
                console.error('Error reading directory:', err);
                return;
            }

            const fileNames = files
                .filter(file => !file.startsWith('.') && !file.endsWith('.srt'))
                .map(file => path.parse(file).name)
                .filter(fileName => fileName !== '');

            res(fileNames);
        });
    })
}


module.exports = handlers;