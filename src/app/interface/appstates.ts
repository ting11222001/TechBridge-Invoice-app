import { DataState } from "../enum/datastate.enum";
import { Customer } from "./customer";
import { Events } from "./event";
import { Role } from "./role";
import { User } from "./user";

export interface Login {
    dataState: DataState;
    loginSuccess?: boolean;
    error?: string;
    message?: string;
    isUsingMfa?: boolean;
    phone?: string;
}

// Same as the HttpResponse class in the backend. 
// Note that @JsonInclude(NON_DEFAULT) means the null fields will be ignored when coming from the backend.
export interface CustomHttpResponse<T> {
    timestamp: Date; // this seems to be string in HttpResponse
    statusCode: number;
    status: string;
    message: string;
    reason?: string;
    developerMessage?: string;
    data?: T;
}

export interface Profile {
    user?: User;
    events?: Events[];
    roles?: Role[];
    access_token: string;
    refresh_token: string;
}

// when creating this, I looked at the response from customerService.customers$
export interface Page {
    content: Customer[];
    totalPages: number;
    totalElements: number;
    numberOfElements: number;
    size: number;
    number: number; // page number and it starts from 0 (default page = 0 in backend CustomerResource > getCustomers)
}

// this defines the final shape of the backend response from customerService.customers$
export interface CustomersPageResponse {
    page: Page;
    user: User;
}