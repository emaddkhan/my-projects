
# Project Engineering Rules

## Product
- Offline-first Windows desktop Grocery POS.
- Grocery is the first industry module.
- Design for future business expansion.

## Technology
- Electron + React.
- JavaScript only.
- No TypeScript.
- SQLite as local database.
- Tailwind CSS.
- ES Modules.

## Architecture
- Keep renderer and main process separated.
- Use secure IPC through preload.
- No direct database access from renderer.
- Keep business logic in services.
- Keep SQL operations in repositories.
- Use database migrations.
- Validate all incoming data.

## Data Integrity
- Store PKR money as integer paisa.
- Use database transactions for sales.
- Maintain stock movement history.
- Never silently delete financial records.
- Preserve historical transaction snapshots.
- Implement backup and restore safely.

## Development
- Inspect existing files before editing.
- Never overwrite unrelated existing files.
- Avoid unnecessary dependencies.
- Implement one milestone at a time.
- Test every implemented feature.
- Never claim completion without verification.

## Offline Requirements
- Core features must work without internet.
- Never require cloud authentication.
- Store all operational data locally.
