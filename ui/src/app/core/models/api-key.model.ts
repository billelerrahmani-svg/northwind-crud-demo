export interface AppApiKey {
  id?: number;
  keyPrefix?: string;
  ownerName: string;
  description?: string;
  enabled: boolean;
  expiresAt?: string | null;
}

export interface ApiKeyCreated {
  id: number;
  rawKey: string;
  keyPrefix: string;
}
