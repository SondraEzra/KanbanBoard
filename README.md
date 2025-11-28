# 🚀 Modern Kanban Board

![Project Preview]

An interactive task management application built with **React** and **Tailwind CSS**, featuring a modern **Kanban** style interface. This project showcases a sleek **Glassmorphism** design, smooth **drag-and-drop** functionality, and dynamic state management.

Designed to demonstrate proficiency in complex state manipulation, responsive UI design, and intuitive user interactions without the need for a backend (utilizing LocalStorage for persistence).

## ✨ Key Features

* **🖱️ Smooth Drag & Drop:** Move tasks between columns or reorder them within the same column with fluid animations (powered by `@hello-pangea/dnd`).
* **🎨 Modern UI (Glassmorphism):** sleek Dark Mode interface featuring aesthetic transparency and blur effects.
* **💾 Auto-Save (LocalStorage):** Tasks and columns are automatically saved to the browser's local storage, ensuring data persistence on refresh.
* **🛠️ Task Management (CRUD):**
    * Create new tasks with Priority levels (High, Medium, Low).
    * Edit task content and priority.
    * Delete tasks with a stylish **Custom Confirmation Modal**.
* **📊 Dynamic Column Management:**
    * Add new columns dynamically.
    * Customize column names and indicator colors.
    * Responsive horizontal scrolling with a **Custom Scrollbar**.
* **⚠️ Custom Alerts:** Replaces default browser alerts with elegant, custom-built confirmation modals.

## 🛠️ Tech Stack

This project is built using a modern, industry-standard tech stack:

* **Framework:** [React 19](https://react.dev/)
* **Build Tool:** [Vite](https://vitejs.dev/) (Blazing fast)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Drag & Drop:** [`@hello-pangea/dnd`](https://github.com/hello-pangea/dnd)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Utility:** [UUID](https://github.com/uuidjs/uuid) (For unique ID generation)

## 🚀 Getting Started (Installation)

Follow these steps to run the project locally on your machine:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    cd your-repo-name
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  Open your browser and navigate to the address shown (usually `http://localhost:5173`).

## 📂 Project Structure

```text
src/
├── assets/          # Static assets (images/svgs)
├── components/      # (Optional: for separated components)
├── index.css        # Tailwind configuration & Global fonts
├── main.jsx         # React entry point
└── App.jsx          # Main Logic (State, DragHandlers, Rendering)