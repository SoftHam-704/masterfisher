# Fix Build Path and React Version

The project is failing to build on Vercel (and locally) due to an incorrect entry point path in `index.html` and potential incompatibility with React 19.

## User Review Required
> [!IMPORTANT]
> Downgrading React from v19 to v18.3.1 to ensure compatibility with Vercel and third-party libraries. This is a safe move for stability.

## Proposed Changes

### Root
#### [MODIFY] [index.html](file:///C:/Users/Systems/.gemini/antigravity/scratch/masterfisher-connect/index.html)
- Change script source from `./index.tsx` to `/src/main.tsx`.

#### [MODIFY] [package.json](file:///C:/Users/Systems/.gemini/antigravity/scratch/masterfisher-connect/package.json)
- Downgrade `react` and `react-dom` to `^18.3.1`.
- Downgrade `@types/react` and `@types/react-dom` to `^18.3.0`.

## Verification Plan

### Automated Tests
- Run `npm install` to apply version changes.
- Run `npm run build` to verify the build completes successfully.
- Run `npm run dev` to ensure the app starts locally without errors.
