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

/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const EditorSlice = createSlice({
  name: 'editor',
  initialState: {
    command: '',
    updateClause: false,
    commandHistory: [],
    commandFavorites: [],
  },
  reducers: {
    setCommand: {
      reducer: (state, action) => {
        state.command = action.payload.command;
        state.updateClause = action.payload.command.match(/(CREATE|REMOVE|DELETE)/g) !== null;
      },
      prepare: (command) => ({ payload: { command } }),
    },
    addCommandHistory: {
      reducer: (state, action) => {
        state.commandHistory.push(action.payload.command);
      },
      prepare: (command) => ({ payload: { command } }),
    },
    addCommandFavorites: {
      reducer: (state, action) => {
        state.commandFavorites.push(action.payload.command);
      },
      prepare: (command) => ({ payload: { command } }),
    },
  },
});

export const { setCommand, addCommandHistory, addCommandFavorites } = EditorSlice.actions;

export default EditorSlice.reducer;
