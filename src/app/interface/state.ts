import { DataState } from "../enum/datastate.enum";

export interface State<T> { // general state of this application
    dataState: DataState;
    appData?: T;
    error?: string;
}