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

import {getQuery} from "../tools/SQLFlavorManager";
import * as util from "util";
import GraphRepository from '../models/GraphRepository';
import { start } from "repl";

class DatabaseService {
    constructor() {
        this._graphRepository = null;
    }

    async getMetaData(graphName) {
        await this._graphRepository.initGraphNames();
        const {graphs} = this._graphRepository.getConnectionInfo();
        if(graphName){
            if(graphs.includes(graphName)){
                return await this.getMetaDataSingle(graphName);
            }else{
                throw new Error('graph does not exist');
            }
            
        }else{
            return await this.getMetaDataMultiple(graphs);
        }

    }

    async getMetaDataMultiple(graphs){
        const metadata = {};
        await Promise.all(graphs.map(async(gname)=>{
            metadata[gname] = await this.getMetaDataSingle(gname);
        }))
        return metadata;
    }

    async getMetaDataSingle(curGraph){
        let metadata = {};
        const {database} = this.getConnectionInfo();
        try {
            let {nodes, edges} = await this.readMetaData(curGraph);
            metadata.nodes = nodes;
            metadata.edges = edges;
            metadata.propertyKeys = await this.getPropertyKeys();
            metadata.graph = curGraph;
            metadata.database = database;
            metadata.role = await this.getRole();
        } catch (error) {
            throw error;
        }
        return metadata;
    }
    /*
    async getGraphLabels() {
        let graphRepository = this._graphRepository;
        let queryResult = {};
        try {
            queryResult = await graphRepository.execute(getQuery('graph_labels'), [this.getConnectionInfo().graph]);
        } catch (error) {
            throw error;
        }

        return queryResult.rows;
    }

    async getGraphLabelCount(labelName, labelKind) {
        let graphRepository = this._graphRepository;
        let query = null;

        if (labelKind === 'v') {
            query = util.format(getQuery('label_count_vertex'), `${this.getConnectionInfo().graph}.${labelName}`);
        } else if (labelKind === 'e') {
            query = util.format(getQuery('label_count_edge'), `${this.getConnectionInfo().graph}.${labelName}`);
        }

        let queryResult = await graphRepository.execute(query);

        return queryResult.rows;
    }*/
    
    async readMetaData(graphName){
        let gr = this._graphRepository;
        let queryResult = await gr.execute(util.format(getQuery('meta_data'), graphName));
        return this.parseMeta(queryResult[1].rows);
    }

    async getPropertyKeys() {
        let graphRepository = this._graphRepository;
        let queryResult = await graphRepository.execute(getQuery('property_keys'));
        return queryResult.rows;
    }

    async getRole() {
        let graphRepository = this._graphRepository;
        let queryResult = await graphRepository.execute(getQuery('get_role'), [this.getConnectionInfo().user]);
        return queryResult.rows[0];
    }

    async connectDatabase(connectionInfo) {
        let graphRepository = this._graphRepository;
        if (graphRepository == null) {
            this._graphRepository = new GraphRepository(connectionInfo);
            graphRepository = this._graphRepository;
        }

        try {
            let client = await graphRepository.getConnection(graphRepository.getConnectionInfo(), true);
            client.release();
        } catch (e) {
            this._graphRepository = null;
            throw e;
        }
        return true;
    }

    async disconnectDatabase() {
        let graphRepository = this._graphRepository;
        if (graphRepository == null) {
            console.log('Already Disconnected');
            return false;
        } else {
            let isRelease = await this._graphRepository.releaseConnection();
            if (isRelease) {
                this._graphRepository = null;
                return true;
            } else {
                console.log('Failed releaseConnection()');
                return false;
            }
        }
    }

    async getConnectionStatus() {
        let graphRepository = this._graphRepository;
        if (graphRepository == null) {
            return false;
        }

        try {
            let client = await GraphRepository.getConnection(graphRepository.getConnectionInfo());
            client.release();
        } catch (err) {
            return false;
        }
        return true;
    }

    getConnectionInfo() {
        if (this.isConnected() === false)
            throw new Error("Not connected");
        return this._graphRepository.getConnectionInfo();
    }

    isConnected() {
        return this._graphRepository != null;
    }

    get graphRepository() {
        return this._graphRepository;
    }

    convertEdge({label, id, start, end, props}) {
        return {
            label: label,
            id: `${id.oid}.${id.id}`,
            start: `${start.oid}.${start.id}`,
            end: `${end.oid}.${end.id}`,
            properties: props,
        };
    }
    parseMeta(data){
        const meta = {
            edges:[],
            nodes:[]
        };
        const vertex = '_ag_label_vertex';
        const edge = '_ag_label_edge';
        let cur = null;
        data.forEach((element, index) => {
            if ( element.label === vertex ){
                cur = 'nodes';
            }
            else if ( element.label === edge ){
                cur = 'edges';
            }
            else{
                meta[cur].push(element);
            }

        });
        return meta;
    }
}

module.exports = DatabaseService;