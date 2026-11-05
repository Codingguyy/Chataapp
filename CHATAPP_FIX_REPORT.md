# ChatApp – Repair Report

## Scope

This pass focused on the defects identified in the source audit and the messaging issues requested: one-to-one and group message actions, reply state, composer overflow, WebSocket bootstrap/multiple tabs, authentication, and message authorization. The existing Next.js/MongoDB/WebSocket architecture and component structure were retained.

## Changes made

### 1. Message actions and persistence

- Hid **Delete for everyone** from messages not authored by the current user in both direct and group chats.
- Kept **Delete for me** available to either participant/member.
- Implemented per-user deletion persistence using a `deletedFor` array in the message documents. A delete-for-me operation now affects only the requesting user's view and remains applied after reload; it no longer changes the shared message status for every participant.
- Filtered per-user deleted messages from initial and paginated direct/group message queries.
- Kept delete-for-everyone restricted to the original sender at the WebSocket handler and database update layers.
- Changed direct-message deletion matching to use the stable `global_id` instead of comparing message text and Date object identity.
- Persisted direct-message deletion before broadcasting the deleted event, and scoped the database update to the sender.

### 2. Replies, editing, and composer

- Persisted direct-message reply metadata in the MongoDB `replyTo` field and normalized it for the UI when loading initial and older messages.
- Kept group replies scoped to a parent message in the same group; the server now rejects a reply target that does not belong to that group.
- Fixed the group reply handler to use the verified user's ID/name rather than attempting to read properties from the JWT string.
- Corrected the group edit action's argument order and its message/group lookup.
- Corrected invalid group message-state conditions that used `||` where both conditions had to be true.
- Reset direct and group reply/edit state and clear the composer after sending/replying/editing.
- Added `min-w-0` constraints to the composer flex layout to prevent the input row from expanding outside its available width.

### 3. Group authorization and rules

- Added server-side checks that the user belongs to an active group before loading or paginating its messages.
- Enforced membership, blocked-member, and `onlyAdminCanMessage` checks before accepting a group message or reply.
- Kept group edit/delete operations scoped to the specified group and original message author.
- Corrected the archived/deleted group condition in group request handling.

### 4. Authentication and data security

- Removed the hardcoded MongoDB URI from `database/db_configure.ts`; it now reads `MONGODB_URI`.
- Removed the hardcoded JWT secret and centralized token signing/verification in `lib/jwt.ts`, requiring `JWT_SECRET` to contain at least 32 characters.
- Changed the `Authenticate` server action so it verifies the email/password against MongoDB before issuing a token. It no longer signs a token based only on client-supplied name/user ID values.
- Increased new password hash cost from bcrypt factor `3` to `12`.
- Added basic registration validation and normalized newly registered/login email addresses.
- Scoped direct-message editing to the authenticated sender and made the database action connect before querying.
- Added server-side PDF/JPEG signature checks and an explicit empty-file check to attachment uploads.

### 5. WebSocket lifecycle and startup

- Added a `bootstrapPromise` and made incoming WebSocket messages wait until MongoDB-backed in-memory maps finish loading.
- Made bootstrap failures visible instead of silently continuing with partially populated maps.
- Added malformed-message handling so invalid JSON/payloads are rejected without crashing the message handler.
- Fixed user socket registration to add another tab's socket instead of replacing the user's existing socket set.
- Stored the authenticated socket identity on login as well as registration, and removed only the closing socket. Offline presence is emitted only after the user's final tab disconnects.
- Awaited asynchronous event handlers so failures are caught by the WebSocket message handler.
- Changed the client socket URL from an `http://` URL to `ws://` or `wss://`, with `NEXT_PUBLIC_SOCKET_URL` override support.
- Added `npm run socket` to start the WebSocket process and `npm run typecheck` for local TypeScript checking.
- Removed debug logs that printed authentication tokens, message payloads, or conversation/user data.

## Files touched

- `database/db_configure.ts`
- `lib/jwt.ts` (new)
- `.env.example` (new)
- `actions/authenticate.ts`, `register.ts`, `loginuser.ts`, `checkuseremail.ts`, `checkusername.ts`
- `actions/editonetooneconversationmessage.ts`, `markonetooneconversations.ts`
- `actions/markonetooneconversationdeleteforme.ts` (new)
- `actions/markgroupconversationdeleteforme.ts` (new)
- `actions/markgroupconversationstatus.ts`, `creategroupmessageedit.ts`, `creategroupreplyconversations.ts`
- `actions/getonetoonefirstconversations.ts`, `getconversationsafteronetooneconversations.ts`
- `actions/getgroupfirstconversations.ts`, `getgroupafterconversations.ts`
- `actions/uploadattachment.ts`
- `models/conversation.js`, `models/groupconversations.js`
- `types/1to1conversations.ts`
- `components/login.tsx`, `register.tsx`, `messagesarea.tsx`, `groupmessagesarea.tsx`
- `components/messagebar.tsx`, `groupmessagesbar.tsx`
- `socketserver/server.ts`, `socketserver/clientsidesocket.ts`
- `package.json`, `README.md`

## Environment setup

Copy `.env.example` to `.env.local` and set:

- `MONGODB_URI` – your MongoDB connection string.
- `JWT_SECRET` – a newly generated random secret of at least 32 characters.
- `SOCKET_PORT` – normally `8080` locally.
- `NEXT_PUBLIC_SOCKET_URL` – `ws://localhost:8080` locally; use the public `wss://` endpoint in production.

Start the app in separate terminals:

```bash
npm install
npm run dev
```

```bash
npm run socket
```

The WebSocket process needs a host that supports persistent WebSocket connections. A standard serverless Next.js function is not a substitute for the socket process.

**Credential warning:** The uploaded source contained a MongoDB connection string with embedded credentials. Those credentials should be rotated in MongoDB Atlas before the repaired project is deployed. Do not reuse the exposed password or an old JWT secret.

## Verification performed

- A source-wide TypeScript/TSX transpilation pass completed without syntax diagnostics.
- Static scans confirmed the hardcoded MongoDB URI and hardcoded JWT signing secret were removed from the source.
- Static checks confirmed the invalid group `||` status condition was corrected and the sender-only UI guards are present.

## Verification not completed

The dependency installation command (`npm ci`) timed out in this environment. As a result, a full dependency-backed `tsc --noEmit`, ESLint run, Next.js production build, and live MongoDB/two-user/group WebSocket test could not be completed here. The project is packaged with the source changes, but this report does not claim a successful runtime or production-build test.

## Recommended smoke tests on your machine

1. Configure `.env.local` with a rotated MongoDB URI and a fresh JWT secret.
2. Run `npm install`, then `npm run typecheck` and `npm run build`.
3. Start Next.js and the socket process in separate terminals.
4. Log in as two users in separate browsers; send, reply to, edit, delete for me, and delete for everyone.
5. Confirm the receiver never sees **Delete for everyone** and can still delete for me.
6. Reload both browsers and confirm delete-for-me persists only for the user who chose it.
7. Repeat the same tests in a group, including a non-admin when admin-only messaging is enabled.
8. Open two tabs for the same account; close one tab and confirm the other remains online and receives messages.
