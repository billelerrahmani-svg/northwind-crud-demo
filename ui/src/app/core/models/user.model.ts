export interface AppUser {
  id?: number;
  username: string;
  password?: string;
  enabled: boolean;
  roleId?: number;
  roleLabel?: string;
}
