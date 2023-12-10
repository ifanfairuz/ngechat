<div align="center">
  
  <a href="https://github.com/ifanfairuz/ngechat">
    <img src="public/favicon.png" alt="Logo" width="80" height="80">
  </a>
  
  <h3 align="center">Ngechat</h3>

  <p align="center">
    This is a Simple Chat App with <a href="https://nextjs.org">Next.js</a>.
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ul>
    <li><a href="#features">Features</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#clone-and-install">Clone and Install</a></li>
        <li><a href="#setup">Setup</a></li>
        <li>
            <a href="#setup">Setup</a>
            <ul>
                <li><a href="#setup-auth0">Setup Auth0</a></li>
                <li><a href="#setup-enviroment">Setup Enviroment</a></li>
                <li><a href="#setup-database">Setup Database</a></li>
            </ul>
        </li>
        <li><a href="#build-and-run">Build and Run</a></li>
      </ul>
    </li>
    <li><a href="#base-path--subdirectory-configuration">Base Path / Subdirectory Configuration</a></li>
  </ul>
</details>

## Features

- :white_check_mark: One on One Chat
- :white_check_mark: Online Status
- :white_check_mark: Typings...
- :white_check_mark: Messages Status
  - :white_check_mark: Sent
  - :white_check_mark: Received
  - :white_check_mark: Read
- :white_check_mark: Search Interlocutor

## Getting Started

### Clone and Install

```bash
git clone https://github.com/ifanfairuz/ngechat.git && cd ngechat

yarn install
# or
bun install
```

### Setup

#### Setup Auth0

This project using [Auth0](https://auth0.com) for authentication, see [documentation](https://auth0.com/docs/quickstart/webapp/nextjs).

1. Create Application

   - Go to your Auth0 [Dashboard](https://manage.auth0.com/dashboard).
   - Go to `Applications` menu.
   - Create Application -> `Machine to Machine Applications`.

2. Configure URLs

   - On Application Detail go to `Settings` Tab scroll to `Application URIs` section.
   - Add `Allowed Callback URLs` with `${yourApplicationBaseURI}/api/auth/callback` example: `http://localhost:3000/api/auth/callback`.
   - Add `Allowed Logout URLs` with `${yourApplicationBaseURI}` example: `http://localhost:3000`.
   - Add `Allowed Web Origins` with `${yourApplicationBaseURI}` example: `http://localhost:3000`.
   - Save Changes

3. Configure Grant Types

   - On Application Detail go to `Settings` Tab scroll to `Advance Settings` on bottom of page.
   - Go to `Grant Types` Tab.
   - Make sure `Client Credentials`,`Authorization Code` is checked.
   - Save Changes

4. Configure APIs

   - On Application Detail go to `APIs` Tab.
   - Make sure your current applicaton has at least one `Auth0 API` Authorized.
   - Make sure Authorized `Auth0 API` has permisson `read:users` - click (chevron down) in Authorized `Auth0 API`.
   - Update.

#### Setup Enviroment

Create `.env.local` file in root folder project, and fill with your Application Auth0 Enviroment, see Application Detail on Auth0 [Dashboard](https://manage.auth0.com/dashboard).

```env
AUTH0_SECRET='use [openssl rand -hex 32] to generate a 32 bytes value'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='${yourDomain}'
AUTH0_CLIENT_ID='{yourClientId}'
AUTH0_CLIENT_SECRET='{yourClientSecret}'
```

#### Setup Database

Support memory storage with null configuration or use [MongoDB](https://www.mongodb.com).

#### using MongoDB

Add some configuration into env file

```env
DB_DRIVER=mongodb
# your connection string
DB_CONNECTION='mongodb://127.0.0.1:27017'
```

### Build and Run

```bash
yarn build && yarn start
# or
bun build && bun start
```

Open [http://localhost:3000](http://localhost:3000) with your browser and start chatting.

### Base Path / Subdirectory Configuration

If you want use base path add some configuration in env file :

```env
# add configuration on the top of content
NEXT_PUBLIC_BASE_PATH='/some/path'
NEXT_PUBLIC_AUTH0_PROFILE="${NEXT_PUBLIC_BASE_PATH}/api/auth/me"
NEXT_PUBLIC_AUTH0_LOGIN="${NEXT_PUBLIC_BASE_PATH}/api/auth/login"
NEXT_PUBLIC_AUTH0_BASE_URL="http://localhost:3000${NEXT_PUBLIC_BASE_PATH}"

...
# change configuration
AUTH0_BASE_URL="${NEXT_PUBLIC_AUTH0_BASE_URL}"
```

Open [http://localhost:3000](http://localhost:3000) with your browser and start chatting.
