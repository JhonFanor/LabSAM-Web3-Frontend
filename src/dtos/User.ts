export interface UserResponseDto {
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