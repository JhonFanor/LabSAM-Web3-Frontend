export interface UserResponse {
    id: number;
    email: string;
    avatar: string;
    role: string; 
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
