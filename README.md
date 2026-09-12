# Nigeria PAYE Calculator 2026

A static, mobile-first React calculator for estimating Nigerian PAYE using the progressive tax bands supplied in the product brief. It is an educational estimate, not an official tax assessment.

The calculator accepts monthly or annual gross income, optional employee pension contribution (percentage or annual amount), and other annual tax reliefs. It recalculates as values change and exposes each applicable progressive band.

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

Deploy the generated `dist` directory to any static host, including Vercel. No environment variables, backend, or database are required; Vercel automatically detects the Vite build settings.
