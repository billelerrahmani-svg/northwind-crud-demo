export interface AppEndpoint {
  id: number;
  httpMethod: string;
  pathPattern: string;
  description?: string;
}
