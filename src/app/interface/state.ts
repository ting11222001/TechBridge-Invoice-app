import { DataState } from "../enum/datastate.enum";

// frontend state machine
export interface State<T> {
    dataState: DataState;
    appData?: T;  // this is T | undefined, NOT T | null
    error?: string;
}