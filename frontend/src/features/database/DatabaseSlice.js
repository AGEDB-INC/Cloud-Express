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
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const connectToDatabase = createAsyncThunk(
  'database/connectToDatabase',
  async (formData) => {
    try {
      const response = await fetch('/api/v1/db/connect', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        return await response.json();
      }

      throw response;
    } catch (error) {
      const errorJson = await error.json();
      throw {
        name: 'Failed to Retrieve Connection Information',
        message: `[${errorJson.severity}]:(${errorJson.code}) ${errorJson.message} `,
        statusText: error.statusText,
      };
    }
  },
);

export const disconnectToDatabase = createAsyncThunk(
  'database/disconnectToDatabase',
  async () => {
    await fetch('/api/v1/db/disconnect');
  },
);

export const getConnectionStatus = createAsyncThunk(
  'database/getConnectionStatus',
  async () => {
    try {
      const response = await fetch('/api/v1/db');

      if (response.ok) {
        return await response.json();
      }

      throw response;
    } catch (error) {
      const errorJson = await error.json();
      throw {
        name: 'Failed to Retrieve Connection Information',
        message: `[${errorJson.severity}]:(${errorJson.code}) ${errorJson.message} `,
        statusText: error.statusText,
      };
    }
  },
);

const initialState = {
  host: '',
  port: '',
  user: '',
  password: '',
  database: '',
  graph: '',
  status: 'init',
  pending: false,
};

const databaseSlice = createSlice({
  name: 'database',
  initialState,
  reducers: {
    changeGraph: (state, action) => {
      state.graph = action.payload.graphName;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(connectToDatabase.pending, (state) => {
        state.pending = true;
      })
      .addCase(connectToDatabase.fulfilled, (state, action) => {
        state.host = action.payload.host;
        state.port = action.payload.port;
        state.user = action.payload.user;
        state.password = action.payload.password;
        state.database = action.payload.database;
        state.graph = action.payload.graph;
        state.status = 'connected';
        state.pending = false;
      })
      .addCase(connectToDatabase.rejected, (state) => {
        state.host = '';
        state.port = '';
        state.user = '';
        state.password = '';
        state.database = '';
        state.graph = '';
        state.status = 'disconnected';
        state.pending = false;
      })
      .addCase(disconnectToDatabase.fulfilled, (state) => {
        state.host = '';
        state.port = '';
        state.user = '';
        state.password = '';
        state.database = '';
        state.graph = '';
        state.status = 'disconnected';
      })
      .addCase(getConnectionStatus.fulfilled, (state, action) => {
        state.host = action.payload.host;
        state.port = action.payload.port;
        state.user = action.payload.user;
        state.password = action.payload.password;
        state.database = action.payload.database;
        state.graph = action.payload.graph;
        state.status = 'connected';
      })
      .addCase(getConnectionStatus.rejected, (state) => {
        state.host = '';
        state.port = '';
        state.user = '';
        state.password = '';
        state.database = '';
        state.graph = '';
        state.status = 'disconnected';
      });
  },
});

export const { changeGraph } = databaseSlice.actions;

export default databaseSlice.reducer;

