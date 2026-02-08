/**
 * Input validation and sanitization utilities
 */

// HTML sanitization to prevent XSS
export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Sanitize string input (trim and limit length)
export function sanitizeString(input: string, maxLength: number = 255): string {
  return input.trim().slice(0, maxLength);
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Validate category name
export function validateCategoryName(name: string): { valid: boolean; error?: string } {
  const sanitized = sanitizeString(name, 50);
  
  if (!sanitized) {
    return { valid: false, error: 'Category name is required' };
  }
  
  if (sanitized.length < 2) {
    return { valid: false, error: 'Category name must be at least 2 characters' };
  }
  
  if (sanitized.length > 50) {
    return { valid: false, error: 'Category name must not exceed 50 characters' };
  }
  
  // Allow letters, numbers, spaces, and common punctuation
  if (!/^[a-zA-Z0-9\s\-_.&()]+$/.test(sanitized)) {
    return { valid: false, error: 'Category name contains invalid characters' };
  }
  
  return { valid: true };
}

// Validate color hex code
export function validateColor(color: string): { valid: boolean; error?: string } {
  if (!/^#[0-9A-Fa-f]{6}$/.test(color)) {
    return { valid: false, error: 'Invalid color format. Use hex format like #FF5733' };
  }
  return { valid: true };
}

// Validate session type
export function validateSessionType(type: string): { valid: boolean; error?: string } {
  const validTypes = ['TEST_HAND', 'QUICK_HAND', 'STANDARD', 'DEEP_STACK'];
  
  if (!validTypes.includes(type)) {
    return { valid: false, error: 'Invalid session type' };
  }
  
  return { valid: true };
}

// Validate quality rating
export function validateQualityRating(rating: number): { valid: boolean; error?: string } {
  if (!Number.isInteger(rating)) {
    return { valid: false, error: 'Quality rating must be an integer' };
  }
  
  if (rating < 1 || rating > 5) {
    return { valid: false, error: 'Quality rating must be between 1 and 5' };
  }
  
  return { valid: true };
}

// Validate session status
export function validateSessionStatus(status: string): { valid: boolean; error?: string } {
  const validStatuses = ['COMPLETED', 'ABANDONED'];
  
  if (!validStatuses.includes(status)) {
    return { valid: false, error: 'Invalid session status' };
  }
  
  return { valid: true };
}

// Validate notes (optional field)
export function validateNotes(notes: string | null | undefined): { valid: boolean; error?: string } {
  if (!notes) {
    return { valid: true };
  }
  
  const sanitized = sanitizeString(notes, 1000);
  
  if (sanitized.length > 1000) {
    return { valid: false, error: 'Notes must not exceed 1000 characters' };
  }
  
  return { valid: true };
}

// Validate UUID format
export function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const cuidRegex = /^c[a-z0-9]{24,25}$/i;
  return uuidRegex.test(id) || cuidRegex.test(id);
}

// Validate pagination parameters
export function validatePagination(limit?: string, offset?: string): {
  limit: number;
  offset: number;
  error?: string;
} {
  const parsedLimit = limit ? parseInt(limit, 10) : 10;
  const parsedOffset = offset ? parseInt(offset, 10) : 0;
  
  if (isNaN(parsedLimit) || parsedLimit < 1) {
    return { limit: 10, offset: 0, error: 'Invalid limit parameter' };
  }
  
  if (isNaN(parsedOffset) || parsedOffset < 0) {
    return { limit: 10, offset: 0, error: 'Invalid offset parameter' };
  }
  
  // Cap limit at 100 to prevent abuse
  const cappedLimit = Math.min(parsedLimit, 100);
  
  return { limit: cappedLimit, offset: parsedOffset };
}
