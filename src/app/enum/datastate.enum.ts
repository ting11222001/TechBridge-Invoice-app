export enum DataState {
    LOADING = 'LOADING_STATE',  // HTTP request in progress
    LOADED = 'LOADED_STATE',    // Data arrived
    ERROR = 'ERROR_STATE',      /// Request failed
}