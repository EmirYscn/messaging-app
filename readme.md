# Messaging App

A full-stack real-time messaging application with support for private, group, and public chats, media sharing, friend requests, and user profiles.

## Features

- **Authentication**: Email/password and OAuth (Google, GitHub) login.
- **Real-time Messaging**: Private, group, and public chat rooms with instant updates via WebSockets.
- **Media Sharing**: Upload and share images in chats.
- **User Profiles**: Editable profiles with avatars and bios.
- **Message Encryption**: Messages are encrypted before storage and decrypted when retrieved, ensuring privacy and security.
- **Friend System**: Send, accept, and manage friend requests.
- **Responsive UI**: Modern, mobile-friendly interface with dark mode support.
- **Admin Features**: Role-based access (admin, user, author).

## Technologies Used

### Frontend (client/)

- **React** (with [Vite](https://vitejs.dev/)) for fast, modern SPA development.
- **TypeScript** for type safety.
- **React Router** for navigation.
- **React Query** for data fetching and caching.
- **Tailwind CSS** for styling.
- **Socket.IO Client** for real-time communication.
- **React Hot Toast** for notifications.
- **ESLint** for code quality.

### Backend (server/)

- **Node.js** with **Express** for REST API.
- **TypeScript** for backend type safety.
- **Prisma** ORM for PostgreSQL database access.
- **Passport.js** for authentication (local, Google, GitHub strategies).
- **Socket.IO** for real-time messaging.
- **Supabase Storage** for media file uploads.
- **Multer** and **Sharp** for file upload and image processing.
- **Zod** for environment variable validation.
- **Helmet, CORS, Rate Limiting** for security.

### Shared

- **shared/types.ts**: Shared TypeScript types between client and server.

## Project Structure

```
client/            # Frontend (React, Vite, Tailwind, etc.)
server/            # Backend (Express, Prisma, Passport, etc.)
shared/            # Shared types
```

## Getting Started

1. **Install dependencies** in both `client/` and `server/`:

   ```sh
   cd client && npm install
   cd ../server && npm install
   ```

2. **Configure environment variables** in `.env` files for both client and server.

3. **Run the development servers**:

   - Start backend:
     ```sh
     cd server && npm run dev
     ```
   - Start frontend:
     ```sh
     cd client && npm run dev
     ```

4. **Access the app** at [Messaging App](https://messaging-app-neon-alpha.vercel.app/) .

_This project uses modern full-stack TypeScript, real-time communication, and cloud storage for a robust chat experience._
