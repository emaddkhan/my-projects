import migration001 from './001_initial.js';
import migration002 from './002_products_and_categories.js';

/**
 * Ordered list of all migrations. Imported statically (rather than scanned
 * from disk) so it works identically in development and inside the packaged
 * ASAR archive. Append new migrations to the end.
 */
export const migrations = [migration001, migration002];
