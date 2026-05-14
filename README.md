# Project Lifecycle Generator

A secure, lightweight web application that automatically creates the first draft for a project lifecycle based on a Project Charter. It extracts relevant information, analyzes the project, and decides the best approach (PMI Waterfall, Agile, or Hybrid) according to industry standards.

## Features

- **Security Priority**: All LLM API calls are handled server-side to prevent API key leakage.
- **Methodology Decision Engine**: Automatically selects the most suitable project approach.
- **Modular Generation**: Creates drafts for Initiation, Planning, WBS, Resource Requirements, Expenses, and Risk/Issue Logs.
- **User Friendly**: Simple, intuitive dashboard designed for all users.

## Prerequisites

- Node.js installed.
- An OpenAI API Key (optional for testing, as the app includes a mock mode).

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Set up Environment Variables**:
   Copy the `.env.example` file to `.env` and add your API keys if available.
   ```bash
   cp .env.example .env
   ```
   *Note: If no API key is provided, the application will run in **Mock Mode** with sample data for demonstration.*

3. **Run the Development Server**:
   ```bash
   npm run dev
   ```

4. **Open the App**:
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/app`: Next.js pages and API routes.
- `src/components`: UI components.
- `src/services`: Core logic and LLM integration.
- `src/lib`: API utilities.
- `src/types`: TypeScript definitions.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
