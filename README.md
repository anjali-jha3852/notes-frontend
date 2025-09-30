##  Frontend–Backend Integration & Scaling for Production

The React + Tailwind frontend communicates with the Node.js + Express backend using REST APIs via Axios.

All API requests (register, login, CRUD) are sent to the backend URL stored in `.env`:

The JWT token (from login) is stored in `localStorage` and added in headers for protected routes:

### 🔒 Protected Routes
- Dashboard is accessible only with a valid token.
- Token validation is handled both client-side and server-side.

### 🌍 Deployment
- **Frontend:** Vercel → [https://notes-frontend-pi-ten.vercel.app](https://notes-frontend-pi-ten.vercel.app)
- **Backend:** Render 
- **Database:** MongoDB Atlas

### 📈 Scaling for Production
- Use **environment variables** for API base URLs.
- Enable **HTTPS** and **CORS** for secure communication.
- Optimize frontend with **code splitting** and **lazy loading**.
- Use **cloud database** and **process managers (PM2/Docker)** for backend scaling.
- Add **rate limiting**, **error handling**, and **logging** for stability.

The app is modular and ready for production deployment.
