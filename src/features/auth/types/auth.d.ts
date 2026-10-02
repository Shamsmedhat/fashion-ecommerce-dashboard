export type Role = "user" | "admin";

export interface Address {
  label: string;
  city: string;
  street: string;
  isDefault: boolean;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  addresses: Address[];
  wishlist: string[];
  createdAt: string;
}

export interface LoginResponse {
  status: ApiSuccessStatus;
  token: string;
  data: {
    user: AdminUser;
    bag: unknown;
  };
}

export interface MeResponse {
  status: ApiSuccessStatus;
  data: {
    user: AdminUser;
  };
}
