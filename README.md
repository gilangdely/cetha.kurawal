# CETHA - Carrer Enhancement Through AI

<a href="https://cetha.kurawal.space">
  <img width="3192" height="981" alt="Frame 46" src="https://github.com/user-attachments/assets/07b9e21d-15ad-477c-a9b6-2e35633e479f" />
</a>

![Version](https://img.shields.io/badge/version-1.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.x-black.svg)
![React](https://img.shields.io/badge/React-19.x-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)


**CETHA** is an innovative AI-driven platform designed to bridge the gap between job seekers and industry standards. We provide instant analysis and practical recommendations to help you optimize your professional assets (CV and LinkedIn) to successfully surpass recruiter screening.

---

## ✨ Key Features

Our platform is built on four core pillars for your career success:

### 1. 🤖 AI-Powered CV Review (AI CV Reviewer)
Forget the confusion of creating a CV! Simply upload your CV (.pdf format), and our AI will analyze it in seconds. You will get:
* **CV Quality Score:** Objective assessment of how good your CV is.
* **In-Depth Analysis:** Insights on what is already good and areas for improvement.
* **Practical Recommendations:** Actionable advice to make your CV stand out.

#### Data Processing Flow
1. **File Upload:** Users upload a `.pdf` CV file through the `UploadCv` component on the CV Review page. The upload limit is 5 times for non-logged-in users, tracked via IP address or Auth session.
2. **File Validation:** The component validates the file format (must be PDF) and displays a preview for the user.
3. **Data Transmission:** The file is sent to the internal Next.js API endpoint at `/api/upload` using *FormData*.
4. **Quota Check:** The API verifies the user's login status and upload quota via *QuotaService*.
5. **AI Processing:** If quota is available, the file is forwarded to the Gradio API server via Hugging Face for analysis.
6. **Results & Quota Consumption:** After obtaining results such as scores, analysis, and recommendations, *QuotaService* logs the quota usage, and JSON data is returned to the frontend.
7. **State Storage:** The test results are saved in a global state management (`useDataReviewStore`) and directed to the Review Results page.

### 2. 👔 LinkedIn Profile Optimization (LinkedIn Optimizer)
Your LinkedIn profile is your professional digital storefront. Cetha helps you polish it to the max. Our AI provides:
* **Comprehensive Profile Review:** Analyzing your headline, summary, experience, and profile picture.
* **Strategic Advice:** Tips to boost your profile's visibility and appeal to recruiters.

#### Data Processing Flow
1. **Username Input:** Users enter their LinkedIn username on the LinkedIn Profile Optimization page.
2. **Data Transmission:** The username is sent to the internal Next.js API endpoint at `/api/linkedin`.
3. **Quota Check:** The API verifies the user's login status and quota via *QuotaService*.
4. **External API Fetch:** The system progressively fetches profile data (_Overview_, _Details_, _Full Experience_, and _Education_).
5. **Quota Consumption:** If the data fetch is successful, *QuotaService* logs the quota usage for the "LinkedIn Optimization" activity.
6. **Returning Results:** The integrated profile data is returned as JSON formatting to the frontend for display.

### 3. 🏢 Job Match
Get job recommendations that perfectly match your skills and experience, directly from your CV analysis.
* **Find Jobs:** Discover the most suitable jobs for your expertise and background.

#### Data Processing Flow
1. **File Upload:** Users upload a `.pdf` CV file via the Job Match page.
2. **File Validation:** The system ensures the uploaded file format is PDF.
3. **Data Transmission:** The file is sent to the internal Next.js API endpoint at `/api/jobrecommend` using *FormData*.
4. **Quota Check:** The API verifies the user's login status and upload quota via *QuotaService*.
5. **AI Processing:** If quota is available, the file is forwarded to the Gradio API via Hugging Face.
6. **Results & Quota Consumption:** Once the JSON job recommendation results are received, *QuotaService* logs the quota usage for "Job Recommendation", and the JSON data is returned to the frontend.

### 4. 🎓 Learning Hub
Career readiness is not just about documents. We provide a library of relevant content to support your personal development:
* **Curated Articles:** Latest insights on career trends, interview tips, and personal branding.
* **Online Classes:** Short courses to hone practical skills needed by the industry.

---

## 🚀 Previews
### 1. CV Review
<img width="1880" height="1022" alt="Screenshot 2026-03-10 141543" src="https://github.com/user-attachments/assets/a5d67efb-fbba-40b8-9900-10e2438995d6" />


### 2. LinkedIn Profile Improvement
<img width="1899" height="893" alt="image" src="https://github.com/user-attachments/assets/1ed51728-6e7d-4eed-beca-c8718ac5e804" />

### 3. Job Match
<img width="1884" height="1029" alt="Screenshot 2026-03-10 142013" src="https://github.com/user-attachments/assets/91d52869-5835-4013-a27e-41df27dd7ce7" />

### 4. Career Dashboard
<img width="1884" height="1020" alt="Screenshot 2026-03-10 141528" src="https://github.com/user-attachments/assets/dd4f64a0-a950-4e82-a2db-b870b2f329b5" />

### 5. CV Builder
<img width="1881" height="1022" alt="Screenshot 2026-03-10 141947" src="https://github.com/user-attachments/assets/d0b14620-7cbb-48f6-a6c7-25c15fc7eee7" />



---

## 📁 Project Structure

```text
cetha.kurawal/
├── 📁 public/                        # Public web assets (images, icons)
├── 📁 scripts/                       # Utility scripts (e.g., for data/admin setup)
└── 📁 src/                           # Main application source code (frontend & API)
    ├── 📁 app/                       # Next.js App Router (pages layout, views, API routes)
    ├── 📁 assets/                    # Internal media files (images, fonts, vectors)
    ├── 📁 components/                # Reusable React components (Radix/Shadcn UI library)
    ├── 📁 features/                  # Feature-specific components, services, and types
    ├── 📁 hooks/                     # Custom React hooks (logic separated from components)
    ├── 📁 i18n/                      # Localization/internationalization setup configurations
    ├── 📁 lib/                       # Utility functions & module initializations (Firebase config)
    ├── 📁 messages/                  # JSON dictionary for each language's translations (i18n)
    ├── 📁 store/                     # Global state management using Zustand store
    └── 📁 types/                     # Global TypeScript type declarations & interfaces
```

---

## 💻 Technologies Used

This project is built with modern technologies to provide a fast, responsive, and intelligent user experience:

* **Frontend:** [Next.js](https://nextjs.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Database:** [Firestore (Google Firebase)](https://firebase.google.com/docs/firestore)
* **Artificial Intelligence:** [Google Gemini](https://ai.google.dev/docs)
* **Cloud Storage:** [Cloudinary](https://cloudinary.com/documentation)
* **Emails:** [Resend](https://resend.com/docs) & [Nodemailer](https://nodemailer.com/)
* **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
* **Components:** [Radix UI](https://www.radix-ui.com/docs) & [Shadcn](https://ui.shadcn.com/docs), [Lucide React](https://lucide.dev/)

---

## 🛠️ Local Setup

Follow the steps below to run Cetha locally:

### Prerequisites

Make sure you have installed:
* [Node.js](https://nodejs.org/en/) (version 18.x or later)
* npm or [Yarn](https://yarnpkg.com/) / [pnpm](https://pnpm.io/)
* Google Firebase, Cloudinary, Resend accounts, and Google Gemini API Key.

### Installation

1. **Clone this repository:**
   ```bash
   git clone https://github.com/gilangdely/cetha.kurawal.git
   cd cetha.kurawal
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**

   Copy `.env.example` to `.env.local` and fill in the values.

   **Linux / macOS**
   ```bash
   cp .env.example .env.local
   ```

   **Windows (CMD)**
   ```cmd
   copy .env.example .env.local
   ```

   **Windows (PowerShell)**
   ```powershell
   Copy-Item .env.example .env.local
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

5. **Access the Application:**
   Open your browser and visit [http://localhost:3000](http://localhost:3000).

---
## 📚 Documentation

| Service | Documentation |
|---|---|
| 🔥 Firebase (Client) | [Firebase Web Setup](https://firebase.google.com/docs/web/setup) |
| 🔐 Firebase Auth | [Firebase Authentication](https://firebase.google.com/docs/auth) |
| 🗄️ Firebase Admin SDK | [Firebase Admin Setup](https://firebase.google.com/docs/admin/setup) |
| 🤖 Google Gemini API | [Gemini API Quickstart](https://ai.google.dev/gemini-api/docs/quickstart) |
| 🖼️ Cloudinary | [Cloudinary Get Started](https://cloudinary.com/documentation/how_to_integrate_cloudinary) |
| 📤 Cloudinary Upload Preset | [Upload Presets](https://cloudinary.com/documentation/upload_presets) |
| 🏷️ Logo.dev | [Logo.dev Docs](https://logo.dev/docs) |
| 🕷️ Apify | [Apify API Reference](https://docs.apify.com/api/v2) |
---

## 👥 Development Team

This project was built by the **Kurawal** team to provide smart solutions for job seekers:
- **Gilang Dely Mukti**
- **Muhammad Agus Priyanto**
- **Firman Aziz**

---

## 🤝 Contributing

We are thrilled if you'd like to contribute to Cetha! Here’s how you can join in:

1. Fork this repository.
2. Create your feature branch (`git checkout -b feature/YourCoolFeature`).
3. Commit your changes with a clear message (`git commit -m 'feat: add cool ai cv analysis'`).
4. Push to the branch (`git push origin feature/YourCoolFeature`).
5. Create a Pull Request.

### 📝 Commit Formatting Standards

To keep the commit history neat, we follow this commit naming convention:

| Type | Description | Example |
| :--- | :--- | :--- |
| `feat:` | Adding a new feature or functionality | `feat: add cv analysis with ai` |
| `add:` | Adding new files, components, or libraries | `add: install shadcn ui form` |
| `fix:` | Bug fixes or resolving errors | `fix: resolve error on pdf load` |
| `docs:` | Documentation updates (README, comments) | `docs: update installation instructions` |
| `style:` | Formatting changes (spacing, structure that doesn't change function) | `style: fix profile indentation` |
| `refactor:`| Restructuring code without adding/changing features | `refactor: extract logic to custom hook` |
| `perf:` | Performance or query optimization code | `perf: optimize firebase data fetching` |
| `chore:` | Routine tasks (update packages, config, maintenance) | `chore: update next.js version` |

---

> *Empowering job seekers with AI-driven insights. Stand out with Cetha and achieve your dream career!*
