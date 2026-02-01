export interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  date_joined: string;
}

export interface UpdateProfileRequest {
  email?: string;
  first_name?: string;
}
