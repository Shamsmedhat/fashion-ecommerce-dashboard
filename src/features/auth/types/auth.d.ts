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

// `status` is the number 200 on login (a backend quirk), not the string "success".
export interface LoginResponse {
  status: number;
  token: string;
  data: {
    user: AdminUser;
    bag: unknown;
  };
}
