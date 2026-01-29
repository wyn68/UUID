export enum UUIDVersion {
  V1 = 'v1',
  V3 = 'v3',
  V4 = 'v4',
  V5 = 'v5',
  V7 = 'v7'
}

export interface GeneratorSettings {
  version: UUIDVersion;
  count: number;
  uppercase: boolean;
  removeHyphens: boolean;
  namespace?: string; // For v3 and v5
  name?: string;      // For v3 and v5
}

export interface UUIDResult {
  id: string;      // Unique key for React list
  value: string;   // The raw UUID
}

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error';
}