# Fyxlife Wellness App 🌱

Welcome to the Fyxlife app! This is a modern, cross-platform mobile application designed to provide a holistic view of personal and family wellness.

This document contains everything you need to run the app and understand its architecture.

---

## Table of Contents

1.  [Running the App (For Non-Technical Users)](#running-the-app-for-non-technical-users)
2.  [Technical Overview & Project Notes](#technical-overview--project-notes)
    *   [Frameworks & Tools Used](#frameworks--tools-used)
    *   [Project Structure](#project-structure)
    *   [Assumptions & Shortcuts](#assumptions--shortcuts)
    *   [Scaling from v0 → v1](#scaling-from-v0--v1)

---

## Running the App (For Non-Technical Users)

This is a friendly, step-by-step guide to get the Fyxlife app running on your phone.

### Step 1: Get Your Computer Ready (One-Time Setup)

First, we need to install a couple of tools. You'll only have to do this once.

1.  **Install Node.js:** This is the engine that helps build the app.
    *   Go to the [Node.js website](https://nodejs.org/).
    *   Download the **LTS** version and install it like any other program.

2.  **Get the App Code:**
    *   Open the **Terminal** (on Mac) or **Command Prompt** (on Windows).
    *   Copy and paste these commands one by one, pressing **Enter** after each:
    ```bash
    # Go to your Desktop
    cd Desktop

    # Download the project code (replace with your project's Git URL)
    git clone https://github.com/Abhisek-Ray99/fyxlife.git fyxlife-app

    # Enter the new project folder
    cd fyxlife-app

    # Install its necessary files (this might take a few minutes!)
    npm install
    ```

### Step 2: Run the App on Your Phone (The Easy Way)

This is the fastest way to see the app live on your own phone.

1.  **Get the "Expo Go" App:**
    *   On your iPhone or Android, search for and install **"Expo Go"** from the App Store / Play Store.

2.  **Start the Project:**
    *   Back in your computer's **Terminal**, make sure you're in the `fyxlife-app` folder and run:
    ```bash
    npm start
    ```

3.  **Scan the QR Code:**
    *   A big QR code will appear on your screen. Make sure your phone and computer are on the **same Wi-Fi**.
    *   Open the **Expo Go** app on your phone, tap **Scan QR Code**, and point it at your computer screen.

Voila! The Fyxlife app will magically appear and start running inside Expo Go.

### Alternative: Running on a Computer Simulator

This is a bit more advanced, but here's the quick version:

*   **For iOS (Mac only):**
    1.  Install **Xcode** from the Mac App Store.
    2.  With the project running in your terminal (from `npm start`), just press the **`i`** key.

*   **For Android:**
    1.  Install **Android Studio**.
    2.  Use it to create and start a virtual phone (an "Emulator").
    3.  With the project running, just press the **`a`** key in your terminal.

---

## Technical Overview & Project Notes

This section provides a summary of the project's technical details, assumptions made during development, and a roadmap for future scaling.

### Frameworks & Tools Used

*   **Core Framework:** **React Native (via Expo)** was chosen for its rapid development capabilities, cross-platform consistency (iOS & Android from a single codebase), and excellent ecosystem.

*   **Key Libraries:**
    *   **Routing:** Expo Router
    *   **Styling:** NativeWind (Tailwind CSS)
    *   **State Management:** Zustand (with AsyncStorage for persistence)
    *   **Animations:** React Native Reanimated
    *   **Charting:** React Native Gifted Charts
    *   **Gestures:** React Native Gesture Handler
    *   **Icons:** Expo Vector Icons

*   **AI Tools Used:** This project was developed with assistance from a large language model (LLM) for boilerplate code generation, documentation, and iterative refinement of components. The AI served as a productivity multiplier, allowing for a primary focus on architecture, UI/UX implementation, and business logic.

### Project Structure

The codebase is organized into a scalable, feature-first structure:

-   `app/`: All screens and navigation logic, managed by Expo Router.
-   `components/`: Reusable UI components, categorized by feature (e.g., `cards`, `charts`, `risk`, `onboarding`).
-   `store/`: Zustand stores for global state management (e.g., `useUserStore`, `useGoalStore`).
-   `hooks/`: Custom React hooks for shared logic (e.g., `useTheme`).
-   `types/`: Centralized TypeScript definitions for data models.
-   `styles/`: Global theme and color palette definitions.

### Assumptions & Shortcuts

In the interest of delivering a feature-complete v0 prototype, the following shortcuts were taken:

*   **No Backend Integration:** All data is currently mocked or stored locally on the device. There are no API calls to a server.
*   **Simplified Business Logic:** The "Health Risk Score" is a simplified heuristic for demonstration purposes.
*   **No Authentication Flow:** The app onboards a user and assumes they are logged in. The "Sign Out" button simply clears local state.
*   **Static Definitions:** The list of available goals and the types of KPIs are currently hardcoded.

### Scaling from v0 → v1

To evolve this prototype into a production-ready v1, the focus would be on **robustness, data integrity, and personalization:**

1.  **Backend & API Layer:**
    *   Develop a secure backend (e.g., Node.js, Python) to manage user accounts, store all health data, and handle business logic.
    *   Implement a full authentication system with secure token management (e.g., JWT, OAuth).

2.  **Third-Party Data Integration:**
    *   Integrate with **Apple HealthKit** and **Google Fit (Health Connect)** to automatically and securely import user data like steps, heart rate, and sleep. This is a critical feature for reducing manual data entry.

3.  **Enhanced Personalization & AI:**
    *   Implement the "AI Suggestions" feature by connecting to a real AI/ML service (e.g., OpenAI's API). The service would take user data as input and provide personalized recommendations.
    *   Develop a robust notification system for reminders, progress updates, and motivational messages.

4.  **Testing & Deployment:**
    *   Introduce a comprehensive testing suite (Unit, Component, and End-to-End).
    *   Set up a CI/CD pipeline using a service like EAS (Expo Application Services) to automate builds and deployments to the App Store and Google Play Store.