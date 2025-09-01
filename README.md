# 💳 Digital E-Visiting Card

The **Digital Card** project is an online platform that allows users to create, update, and share their **E-Visiting Cards**.  
It provides a **public link** for anyone to view the card, while only the card owner (logged-in user) can update the details.

---

## 🚀 Live Demo
🔗 [View Deployed App](https://spectacular-tulumba-7768c7.netlify.app/)

---

## 📸 Dashboard Preview
![Dashboard Screenshot](<DASHBOARD_IMAGE_PATH>)

---

## ✨ Features
- 🔐 **Authentication** – Secure login & registration for users.  
- 📝 **Card Management** – Create, update, and manage your digital visiting card.  
- 🌍 **Public Sharing** – Shareable link to showcase card details publicly.  
- 🎨 **Responsive UI** – Optimized for desktop and mobile devices.  
- ⚡ **React Router Integration** – Smooth navigation across pages.  
- 📡 **Firebase Backend** – Secure storage and real-time updates.  

---

## 🛠️ Tech Stack
- **Frontend:** React, React Router, Context API  
- **Backend / Auth:** Firebase  
- **Styling:** CSS, Flexbox, Media Queries  
- **Hosting:** Netlify / Vercel / Firebase Hosting  

---

## 📂 Folder Structure

```
digital-card/
├── public/
├── src/
│   ├── components/    # Reusable UI components
│   ├── context/       # Auth provider
│   ├── pages/         # Page components (Dashboard, VisitingCard, Login, etc.)
│   ├── App.js         # Main app file with routes
│   └── index.js       # Entry point
└── README.md
```

---

## ⚡ Setup & Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/digital-card.git
   cd digital-card
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup Firebase:
   - Create a Firebase project.  
   - Enable **Authentication** & **Firestore Database**.  
   - Add Firebase config in a `.env` file.  

4. Start development server:
   ```bash
   npm start
   ```

5. Build for production:
   ```bash
   npm run build
   ```

---

## 🔗 Public Card Link Example

Each user gets a unique public card link:

```
https://yourdomain.com/card/<userId>
```

- Anyone can **view** the card.  
- Only the owner can **update** it after logging in.  

---

## 👨‍💻 Author

**Aletti Pranay**  
🔗 [GitHub](https://github.com/Pranay9392)

