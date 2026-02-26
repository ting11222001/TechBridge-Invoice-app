export interface User {
    // same as the UserDTO
    id: number;
    firstName: string;
    lastName: string;
    email: string;  // don't need to send the password to the frontend
    address?: string;
    phone?: string;
    title?: string;
    bio?: string;
    imageUrl?: string;
    enabled: boolean;
    isNotLocked: boolean;
    usingMfa: boolean;  // to be the same as the response > data > user object from sendVerificationCode in UserResource
    createdAt?: Date;
    roleName: string;    // Map the role name and permissions of the user also
    permissions: string;

}
