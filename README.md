Features I Have Added:
User Login & Signup — Using JWT, bcrypt and cookies which are HTTP-only for better security

Session Create and Edit — Users can make wellness sessions and edit them anytime

Auto Save Drafts — If user stops typing for 5 sec, the draft auto saved

Public Sessions — Anyone can view all published sessions

My Sessions Page — Logged in users can see their own drafts and published session

Session Editor — Editor to add title, tags, and URL for JSON file and more

Mobile Responsive — Frontend made in React and TailwindCSS, so works fine on all devices

Tech Stack I Used:
Frontend — React, React Router, Axios, TailwindCSS

Backend — Node.js, Express, MongoDB with Mongoose

Authentication — JWT token, bcrypt, HTTP-only cookies

Others — dotenv, cookie-parser, helmet, express-rate-limit for protection

Folder Structure (How I Managed Project)
backend/
models/ # Mongo models like User and Session
routes/ # APIs for auth and session
middleware/ # Middleware for checking JWT
utils/ # token and other helpers
server.js # Main backend file
package.json # Backend packages
env.example # Example env file

frontend/
src/
pages/ # Pages like Dashboard, MySessions, Editor
components/ # Navbar, Spinners etc
contexts/ # Auth context here
index.js # Main react file
index.css # Tailwind styles
App.js # Routing and main layout
public/ # Static things
package.json # Frontend packages
tailwind.config.js
postcss.config.js

package.json # main one
API Endpoints (I created this backend)
Auth
POST /api/auth/register — new user signup

POST /api/auth/login — login user and send JWT cookie

POST /api/auth/logout — logout user and clear cookie

GET /api/auth/me — fetch user info from cookie

Sessions
GET /api/sessions — get all published sessions

GET /api/sessions/:id — view one session

GET /api/sessions/my-sessions — get my own sessions (drafts + published)

GET /api/sessions/my-sessions/:id — get one session (only mine)

POST /api/sessions/my-sessions/save-draft — save draft

POST /api/sessions/my-sessions/publish — publish session

Frontend Pages I Made
/register — new user register

/login — login page

/ — main dashboard with all public sessions

/my-sessions — show my sessions (both draft and published)

/session/new — new session editor

/session/edit/:id — editing already created session

/session/:id — view single public session

Extra Things I Tried
All sensitive info like DB URL and secret keys are kept in .env (not pushed)

I also added views count for sessions

Planned to add chat in future for better wellness communication

Frontend Logic (React Side)
AuthContext — Stores user info and helps with login/logout/register

Pages:

Dashboard: shows all public sessions

MySessions: where user manage own sessions

SessionEditor: create or edit session and auto-save feature

SessionView: see detail of a session

Login/Register: form pages

Components — Navbar, Loading spinner, buttons etc

Auto Save — in the editor, if user is inactive for 5 sec it saves draft automatically

Security Things I Took Care of
JWT in HTTP-only cookies so browser stores it safely

bcrypt to encrypt password

CORS only allows my frontend

helmet to secure headers

rate-limit so no one can spam API

validations are added in both backend and frontend

🙏 Credits
This is my personal full-stack project made using MERN Stack (MongoDB, Express, React, Node.js) with ❤️.
Still learning and improving more features!