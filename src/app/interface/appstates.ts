import { DataState } from "../enum/datastate.enum";
import { Events } from "./event";
import { Role } from "./role";
import { User } from "./user";

export interface LoginState {
    dataState: DataState;
    loginSuccess?: boolean;
    error?: string;
    message?: string;
    isUsingMfa?: boolean;
    phone?: string;
}

export interface CustomHttpResponse<T> { // Same as the HttpResponse class in the backend
    timestamp: Date;
    statusCode: number;
    status: string;
    message: string;
    reason?: string;
    developerMessage?: string;
    data?: T;
}

export interface ProfileState {
    user?: User;
    events?: Events[];
    roles?: Role[];
    access_token: string;
    refresh_token: string;
}