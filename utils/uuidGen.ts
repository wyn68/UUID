import { v1, v3, v4, v5, v7, validate } from 'https://esm.sh/uuid@10.0.0';
import { UUIDVersion, UUIDResult } from '../types';

// Constants for v3/v5 Namespace placeholders
export const DNS_NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
export const URL_NAMESPACE = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';

/**
 * Generates a batch of UUIDs based on the selected version and quantity.
 */
export const generateUUIDs = (
  version: UUIDVersion,
  count: number,
  namespace: string = DNS_NAMESPACE,
  name: string = ''
): UUIDResult[] => {
  const results: UUIDResult[] = [];
  
  // Safe validation for namespace
  const safeNamespace = validate(namespace) ? namespace : DNS_NAMESPACE;
  const safeName = name || 'example.com';

  for (let i = 0; i < count; i++) {
    let value = '';
    const uniqueId = crypto.randomUUID(); // For React keys

    try {
      switch (version) {
        case UUIDVersion.V1:
          value = v1();
          break;
        case UUIDVersion.V3:
          // For v3/v5 batch generation, we append the index to the name 
          // to ensure unique results if the user requests > 1
          value = v3(count > 1 ? `${safeName}-${i}` : safeName, safeNamespace);
          break;
        case UUIDVersion.V4:
          value = v4();
          break;
        case UUIDVersion.V5:
          value = v5(count > 1 ? `${safeName}-${i}` : safeName, safeNamespace);
          break;
        case UUIDVersion.V7:
          value = v7();
          break;
        default:
          value = v4();
      }
    } catch (e) {
      console.error("UUID Generation Error", e);
      value = "UUID 生成错误";
    }

    results.push({ id: uniqueId, value });
  }

  return results;
};

/**
 * Formats a UUID string based on display settings.
 */
export const formatUUID = (
  uuid: string,
  uppercase: boolean,
  removeHyphens: boolean
): string => {
  let formatted = uuid;
  if (removeHyphens) {
    formatted = formatted.replace(/-/g, '');
  }
  if (uppercase) {
    formatted = formatted.toUpperCase();
  }
  return formatted;
};