# MCP Test

This project is a personal sandbox to test and study **Claude Code** — understanding how it works, how it handles context, agents, skills, MCP servers, and everything related to incrementing developer productivity by delegating development tasks to AI.

## Purpose

- Explore Claude Code capabilities (agents, skills, hooks, slash commands)
- Understand how context handling works across conversations
- Test MCP (Model Context Protocol) server integrations (e.g., Figma)
- Practice delegating real development tasks to AI and evaluate the results
- Learn best practices for AI-assisted development workflows

## Features

- Authentication module with login and register flows
- State management using NgRx Signals with Redux DevTools integration
- Standalone components architecture (Angular 19+)
- Reactive forms with Angular Forms module
- Routing with Angular Router

## Tech Stack

- **Angular** 19.2
- **NgRx Signals** 19.2 — state management based on Angular Signals
- **@angular-architects/ngrx-toolkit** — Redux DevTools integration for NgRx Signals
- **RxJS** 7.8
- **TypeScript** 5.7
- **Karma + Jasmine** — unit testing

## Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- npm >= 10

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/Mauro-devhub/small-project-with-claude-code.git
```

2. Navigate to the project directory:

```bash
cd small-project-with-claude-code
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm start
```

5. Open your browser at `http://localhost:4200/`

## Available Scripts

| Command | Description |
|---|---|
| `npm start` | Start development server |
| `npm run build` | Build for production |
| `npm run watch` | Build in watch mode (development) |
| `npm test` | Run unit tests with Karma |
