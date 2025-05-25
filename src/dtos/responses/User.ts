export interface UserMinimalResponse {
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