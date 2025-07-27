export interface UserResponse {
    id: number;
    email: string;
    avatar: string;
    role: string; 
    permissions?: string[];
}

export interface UserMinimalResponse {
  	id: number;
    avatar: string;
    regular_user?: {
      name: string;
    };
    university_user?: {
      name: string;
    };
    business_user?: {
      name: string;
    };
}

export interface UserGetAllResponse {
  	id: number;
    email: string;
    avatar: string;
    role_id: string;
    regular_user?: {
      name: string;
    };
    university_user?: {
      name: string;
    };
    business_user?: {
      name: string;
    };
}

export interface UserGetResponse {
  	id: number;
    email: string;
    avatar: string;
    role_id: number;
    regular_user?: {
      name: string;
    };
    university_user?: {
      name: string;
    };
    business_user?: {
      name: string;
    };
}