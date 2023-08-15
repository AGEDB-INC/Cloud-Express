/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
const sessionService = require('../services/sessionService');
const winston = require('winston');

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
  });
  
  const upload = multer({ storage: storage });

class DatabaseController {

    constructor() {
        const upload = multer({ storage: storage });
        this.uploadFiles = this.uploadFiles.bind(this, upload);
    }
    
    async uploadFiles(upload, req, res) {
    try {   
        upload.single('file')(req, res, async (err) => {
        if (err) {
            console.error('Error uploading file:', err);
            res.status(500).json({ error: 'Error uploading file' });
            return;
        }
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }
        const filePath = path.join(__dirname, '../../uploads', req.file.filename);
        res.json({ message: 'File uploaded successfully', filePath });
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Error uploading file' });
    }
    }

    async getFilesInfo(req, res) {
        try {
          const directories = ['Graph for Car Specification', 'Graph for Cyber Security', 'Graph for P2P Evaluation'];
          const fileInfoPromises = [];
      
          directories.forEach((dir) => {
            const directoryPath = path.join(__dirname, `../../uploads/SampleCSVs/${dir}`);
            const promise = new Promise((resolve, reject) => {
              fs.readdir(directoryPath, (err, files) => {
                if (err) {
                  console.error(`Error reading directory ${dir}:`, err);
                  resolve([]); // Resolve with an empty array for this directory
                } else {
                  const fileInfo = files.map((file) => {
                    const filePath = path.join(directoryPath, file);
                    const type =
                      file.includes('eg_')
                        ? 'edge'
                        : 'node';
                    return { name: file, path: filePath, type };
                  });
                  resolve(fileInfo);
                }
              });
            });
            fileInfoPromises.push(promise);
          });
      
          const fileInfos = await Promise.all(fileInfoPromises);
      
          // Organize fileInfos based on directories
          const response = directories.reduce((acc, dir, index) => {
            acc[dir] = fileInfos[index];
            return acc;
          }, {});
      
          res.json(response);
        } catch (error) {
          console.error('Error reading directories:', error);
          res.status(500).json({ error: 'Error reading directories' });
        }
      }
      
      async CleanUpUploadedFiles() {
        const uploadsFolderPath = path.join(__dirname, '../../uploads');
      
        try {
          const files = await fs.readdir(uploadsFolderPath);
      
          // Filter CSV files
          const csvFiles = files.filter(file => path.extname(file).toLowerCase() === '.csv');
      
          // Delete each CSV file
          for (const csvFile of csvFiles) {
            const filePath = path.join(uploadsFolderPath, csvFile);
            await fs.unlink(filePath);
            console.log(`Deleted file: ${csvFile}`);
          }
      
          console.log('Cleanup completed');
        } catch (error) {
          console.error('Error cleaning up files:', error);
        }
      }
      
    // async getFilesInfo(req, res) {
    //     try {   
    //         const directoryPath = path.join(__dirname, '../../uploads/SampleCSVs');
    //         console.log(directoryPath);
    //         fs.readdir(directoryPath, (err, files) => {
    //             if (err) {
    //                 console.error('Error reading directory:', err);
    //                 res.status(500).json({ error: 'Error reading directory' });
    //                 return;
    //             }
        
    //             let fileInfoPromises = files.map(file => {
    //                 return new Promise((resolve, reject) => {
    //                     let filePath = path.join(directoryPath, file);
                        
    //                     fs.readFile(filePath, 'utf8', (err, data) => {
    //                         if (err) {
    //                             reject('Error reading file:', err);
    //                         }
    //                         else {
    //                             let type = file.includes('[') && file.includes('&') && file.includes(']') ? 'edge' : 'node';
    //                             resolve({
    //                                 name: file,
    //                                 path: filePath,
    //                                 type: type
    //                             });
    //                         }
    //                     });
    //                 });
    //             });
        
    //             Promise.all(fileInfoPromises)
    //                 .then(fileInfo => res.json(fileInfo))
    //                 .catch(error => {
    //                     console.error(error);
    //                     res.status(500).json({ error: 'Error reading files' });
    //                 });
    //         });
    //     } catch (error) {
    //         console.error('Error reading directory:', error);
    //         res.status(500).json({ error: 'Error reading directory' });
    //     }
    // }
    
    async connectDatabase(req, res, next) {
        let databaseService = sessionService.get(req.sessionID);
        if (!databaseService.isConnected()) {
            await databaseService.connectDatabase(req.body);
        }
        const connectionInfo = databaseService.getConnectionInfo();
        res.status(200).json(connectionInfo).end();
    }

    async disconnectDatabase(req, res, next) {
        let databaseService = sessionService.get(req.sessionID);
        if (databaseService.isConnected()) {
            let isDisconnect = await databaseService.disconnectDatabase();

            if (isDisconnect) {
                res.status(200).json({msg: 'Disconnect Successful'}).end();
            } else {
                res.status(500).json({msg: 'Already Disconnected'}).end();
            }
        } else {
            throw new Error('Not connected');
        }
    }

    async getStatus(req, res, next) {
        let databaseService = sessionService.get(req.sessionID);
        if (databaseService.isConnected()) {
            await databaseService.getConnectionStatus();
            res.status(200).json(databaseService.getConnectionInfo()).end();
        } else {
            throw new Error('Not connected');
        }
    }

    async getMetadata(req, res, next) {
        let databaseService = sessionService.get(req.sessionID);
        if (databaseService.isConnected()) {
            let metadata = await databaseService.getMetaData(req.body);
            res.status(200).json(metadata).end();
        } else {
            throw new Error('Not connected');
        }
    }
    /*
    async getMetaChart(req, res, next) {
        let databaseService = sessionService.get(req.sessionID);
        if (databaseService.isConnected()) {
            let metadata = [];
            try {
                let graphLabels = await databaseService.getGraphLabels();
                for (let labels of graphLabels) {
                    let countResults = await databaseService.getGraphLabelCount(labels.la_name, labels.la_kind)
                    for (let idx in countResults) {
                        if (idx > 0) {
                            labels.la_name = labels.la_name + "-" + idx
                            labels.la_oid = labels.la_oid + (idx * 0.1)
                        }
                        metadata.push(Object.assign({}, labels, countResults[idx]))
                    }
                }
                res.status(200).json(metadata).end();
            } catch (error) {
                res.status(500).json(metadata).end();
            }
        } else {
            throw new Error('Not connected');
        }
    }*/
}

module.exports = DatabaseController;
