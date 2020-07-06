const fs = require('fs');
const admin = require('firebase-admin');
//import fs from 'fs';
//import * as admin from 'firebase-admin';

const serviceAccount = require('./firebase-adminsdk.json');
const config = require('./config.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    ...config
});

// process.argv
const dir = process.env.npm_config_dir || '.';
console.log('firewatch is watching:', dir);

fs.watch(dir, (eventType, filename) => {
    if (eventType == 'change') {
        const path = [dir, filename].join('/');
        console.log('path:', path);
        admin.storage().bucket().upload(path)
            .then(response => {
                console.log(`Succeed to upload ${path} to Firebase: ${response}`);
            })
            .catch(reason => {
                console.error(`Failed to upload ${path} to Firebase: ${reason}`);
            });
    }
});