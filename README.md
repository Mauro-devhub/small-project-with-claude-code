# About Project

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

## Mcp's

- Locally I have install figma MCP to AI get nodes design from project figma and develop code and UI

## Tech Stack

| Category | Tool | Version | Description |
|---|---|---|---|
| Framework | **Angular** | 19.2 | Core application framework with standalone components |
| Language | **TypeScript** | 5.7 | Typed superset of JavaScript |
| State Management | **NgRx Signals** | 19.2 | State management based on Angular Signals |
| DevTools | **@angular-architects/ngrx-toolkit** | 19.5 | Redux DevTools integration for NgRx Signals |
| Reactive | **RxJS** | 7.8 | Reactive programming with observables |
| Unit Testing | **Karma** + **Jasmine** | 6.4 / 5.6 | Test runner and assertion framework |
| E2E Testing | **Playwright** | 1.58 | End-to-end testing across Chromium and Firefox |

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
| `npm run test:e2e` | Run E2E tests with Playwright |
| `npm run test:e2e:headed` | Run E2E tests with visible browser |
| `npm run test:e2e:ui` | Open Playwright interactive UI mode |
| `npm run test:e2e:debug` | Run E2E tests in debug mode |
| `npm run test:e2e:report` | Open Playwright HTML report |
