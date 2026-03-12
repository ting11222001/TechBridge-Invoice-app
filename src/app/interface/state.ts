import { DataState } from "../enum/datastate.enum";

// frontend state machine
export interface State<T> {
    dataState: DataState;
    appData?: T;
    error?: string;
}