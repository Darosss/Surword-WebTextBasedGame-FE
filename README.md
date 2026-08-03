# Surword - Web Text Based Game (Frontend)

This repository contains the frontend client for the Surword text-based RPG. The UI is built with Next.js and React, and it integrates with a separate backend service hosted in a companion repository.

> Backend implementation: https://github.com/Darosss/Surword-WebTextBasedGame

## Overview

Surword is a browser-focused text RPG with character management, dungeon battles, skirmishes, merchants, leaderboards, and fight report visualization.

This frontend handles:

- user authentication and session management
- character overview, stats, inventory, and equipment
- dungeon selection and battle initiation
- skirmish list and current challenge flow
- leaderboards and fight report presentation
- responsive UI and drag-and-drop equipment/inventory interactions

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS + Sass
- Radix UI components
- react-dnd for drag-and-drop interactions
- react-toastify for notifications
- js-cookie for auth token management

## Features

- login and registration workflows
- hero and inventory display with rich item details
- merchant buying/selling experience
- dungeon and skirmish UI
- fight report playback and combat log visualization
- leaderboard categories and refresh timers
- modular component architecture with shared hooks and API client utilities

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
copy env.example .env
```

3. Update `.env` with your backend URL and any required settings.

4. Start the development server:

```bash
npm run dev
```

5. Open http://localhost:3000 in your browser.

## Environment Variables

The project uses the following environment variable(s):

- `NEXT_PUBLIC_BACKEND_URL` - base URL for the backend API (example: `http://localhost:8080/`)

## Available Scripts

- `npm run dev` - run the app in development mode
- `npm run build` - build the production application
- `npm run start` - start the production build
- `npm run lint` - run ESLint checks

## Project Structure

- `src/app` - Next.js routes and page layout
- `src/components` - reusable UI components organized by domain
- `src/api` - API client logic, request helpers, and shared types
- `src/hooks` - custom hooks for fetching and timer behavior
- `src/lib` / `src/utils` - utility functions and helpers
- `src/styles` - global and component styles

## Development Notes

- The frontend depends on the backend service for game data and authentication.
- Authentication state is managed using cookies and a centralized auth context.
- API requests are sent to the configured backend URL via a custom fetch wrapper.

## Future Improvements

- add automated tests for key components and hooks
- improve error handling and offline support
- polish accessibility and keyboard interaction behavior
- add visual screenshots or demo assets to the README

## Contact

Darosss - darosss12@proton.me
