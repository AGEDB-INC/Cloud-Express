import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const connectToAgensGraph = createAsyncThunk(
  'database/connectToAgensGraph',
  async (formData) => {
    try {
      const response = await fetch('/api/v1/db/connect',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        })
      if (response.ok) { return await response.json(); }
      throw response
    } catch (error) {
      const errorDetail = {
        name: 'Database Connection Failed'
        , statusText: error.statusText
      }
      throw errorDetail

    }
  }
)

export const disconnectToAgensGraph = createAsyncThunk(
  'database/disconnectToAgensGraph',
  async () => {
    return await fetch('/api/v1/db/disconnect')
  }
)

export const getConnectionStatus = createAsyncThunk(
  'database/getConnectionStatus',
  async () => {
    try {
      const response = await fetch('/api/v1/db')
      if (response.ok) { return await response.json(); }
      throw response
    } catch (error) {
      const errorDetail = {
        name: 'Failed to Retrieve Connection Information'
        , statusText: error.statusText
      }
      throw errorDetail

    }
  }
)


const DatabaseSlice = createSlice({
  name: 'database',
  initialState: {
    status: 'init'
  },
  reducers: {
  },
  extraReducers: {
    [connectToAgensGraph.fulfilled]: (state, action) => {
      return {
        host: action.payload.host
        , port: action.payload.port
        , user: action.payload.user
        , password: action.payload.password
        , database: action.payload.database
        , graph: action.payload.graph
        , status: 'connected'
      }
    },
    [connectToAgensGraph.rejected]: (state, action) => {
      alert(action.error.name)
      return {
        host: ''
        , port: ''
        , user: ''
        , password: ''
        , database: ''
        , graph: ''
        , status: 'disconnected'
      }
    },
    [disconnectToAgensGraph.fulfilled]: (state, action) => {
      return {
        host: ''
        , port: ''
        , user: ''
        , password: ''
        , database: ''
        , graph: ''
        , status: 'disconnected'
      }
    },
    [getConnectionStatus.fulfilled]: (state, action) => {
      return {
        host: action.payload.host
        , port: action.payload.port
        , user: action.payload.user
        , password: action.payload.password
        , database: action.payload.database
        , graph: action.payload.graph
        , status: 'connected'
      }
    },
    [getConnectionStatus.rejected]: (state, action) => {
      return {
        host: ''
        , port: ''
        , user: ''
        , password: ''
        , database: ''
        , graph: ''
        , status: 'disconnected'
      }
    }
  }
})

/*
export const { } = DatabaseSlice.actions
*/
export default DatabaseSlice.reducer