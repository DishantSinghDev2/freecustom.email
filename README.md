# FreeCustom.Email - Open Source


This is the open-source Next.js frontend for a fully functional temporary email website. It's designed to work with the **[Temp-Mail Maildrop API on RapidAPI](https://rapidapi.com/dishis-technologies-maildrop/api/temp-mail-maildrop1)**.

This project was created to make temporary email technology accessible to everyone. Whether you're a developer, a student, or just a tech enthusiast, you can use this project to launch your own temp mail service in minutes.

**Live Demo:** [FreeCustom.Email](https://www.freecustom.email)



---

## Hey, Hack Clubbers! 🚀

Welcome! This project is a perfect way to dive into full-stack development with Next.js and learn how to work with external APIs. You can get your own temporary email service running in less time than it takes to eat a pizza. Let's get hacking!

### What You'll Learn

*   How to clone a project and get it running locally.
*   How to work with environment variables to keep secrets safe.
*   How to connect a frontend application to a backend API.
*   How to deploy a web app to the internet for free.

---

## Getting Started: Build Your Site in 5 Minutes

Follow these simple steps to get your temp mail website up and running.

### Prerequisites

*   **Node.js:** Make sure it's installed on your computer. You can get it from [nodejs.org](https://nodejs.org/).
*   **Git:** You'll need this to clone the project. Get it from [git-scm.com](https://git-scm.com/).
*   **A RapidAPI Account:** It's free! Sign up at [rapidapi.com](https://rapidapi.com/).

### Step 1: Clone This Repository

Open your terminal (like Terminal on Mac, or Git Bash/WSL on Windows) and run this command:

```bash
git clone https://github.com/DishIs/temp-mail.git
```

Now, jump into the project folder:

```bash
cd temp-mail
```

### Step 2: Install the Goodies (Dependencies)

Use `npm` to install all the packages the project needs.

```bash
npm install
```

### Step 3: Set Up Your API Keys

This is the most important part! You need to tell the app how to talk to the backend API.

1.  **Get Your API Key from RapidAPI:**
    *   Go to the [Temp-Mail Maildrop API page](https://rapidapi.com/dishis-technologies-maildrop/api/temp-mail-maildrop1).
    *   Click the **"Subscribe to Test"** button. This will let you use the API for free (up to 151 times a day!).
    *   Go back to the **"Endpoints"** tab. On the right side, you'll see your API keys. You need two things:
        *   `X-RapidAPI-Key`: This is your secret key.
        *   `X-RapidAPI-Host`: This is `temp-mail-maildrop1.p.rapidapi.com`.

2.  **Create Your Secrets File:**
    *   In your project folder, find the file named `.env.example`.
    *   Duplicate this file and rename the copy to just `.env`.

3.  **Add Your Keys to the `.env` file:**
    *   Open your new `.env` file with a code editor (like VS Code).
    *   It will look like this:
        ```
        RAPIDAPI_URL=
        RAPIDAPI_KEY=
        ```
    *   Fill it in with the info from RapidAPI:
        ```
        RAPIDAPI_URL=https://temp-mail-maildrop1.p.rapidapi.com
        RAPIDAPI_KEY=PASTE_YOUR_X-RAPIDAPI-KEY_HERE
        ```
    *   Save the file. The `.gitignore` file is already set up to ignore this, so you won't accidentally share your secret key on GitHub.

### Step 4: Run Your Website!

You're all set. Run the development server with this command:

```bash
npm run dev
```

Open your web browser and go to **[http://localhost:3000](http://localhost:3000)**.

You should see your very own temp mail website running live on your computer!

---

## Deployment: Share Your Creation with the World

Running it on your computer is cool, but let's get it online so everyone can use it. The easiest way to do this is with **Vercel**.

*   **Vercel (Recommended):**
    1.  Sign up for a free account at [vercel.com](https://vercel.com) using your GitHub account.
    2.  Push your cloned project to your own GitHub repository.
    3.  On your Vercel dashboard, click "Add New... > Project".
    4.  Select your new GitHub repository.
    5.  Vercel will automatically detect that it's a Next.js project. Before you deploy, go to the "Environment Variables" section and add your `RAPIDAPI_URL` and `RAPIDAPI_KEY` just like you did in your `.env` file.
    6.  Click **"Deploy"**.

In a minute or two, your site will be live on the internet with a free `.vercel.app` URL!

---

## 🤝 Contributing

This is an open-source project, and we welcome contributions from the community! If you find a bug, have an idea for a new feature, or want to improve the code:

1.  **Fork the repository:** Create your own copy of the project.
2.  **Create a new branch:** `git checkout -b feature/your-awesome-idea`
3.  **Make your changes.**
4.  **Submit a Pull Request:** Explain your changes and why they're cool.

We'll review it and merge it in!

## Community & Support

Got questions? Built something cool with this project? We want to hear from you!

*   **Join the Discussion:** Head over to the [RapidAPI Discussions Forum](https://rapidapi.com/dishis-technologies-maildrop/api/temp-mail-maildrop1/discussions) to ask questions, share what you've built, or get help.

Happy Hacking