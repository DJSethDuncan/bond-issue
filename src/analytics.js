import { inject } from '@vercel/analytics';

// Page analytics only: do not track calculator inputs or election selections.
if (import.meta.env.PROD) {
  inject({ mode: 'production' });
}
