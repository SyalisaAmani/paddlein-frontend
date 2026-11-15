
# Paddlein Frontend

Frontend application for **Paddlein**, a padel court booking platform built with React and Vite.

Paddlein allows customers to explore padel courts, check availability, make reservations, and manage their bookings. Administrators can manage courts, reservations, and payment statuses.

## Tech Stack

- React
- Vite
- JavaScript
- Tailwind CSS
- Axios
- React Router

## Features

### Landing Page
- Responsive navigation
- Hero section
- Court catalog
- Search and filtering
- FAQ and assistant interface

### Authentication
- Customer login and registration
- Protected routes
- Role-based access for Admin and Customer

### Customer
- View available courts
- View court details
- Check court availability
- Make bookings
- Manage personal bookings
- View profile

### Admin
- Dashboard overview
- Manage courts
- Manage bookings
- View booking details
- Update payment status

## Installation

Clone the repository:

```bash id="44ec75"
git clone https://github.com/SyalisaAmani/paddlein-frontend.git
cd paddlein-frontend
```

Install dependencies:

```bash id="ce6jk8"
npm install
```

Start the development server:

```bash id="p1uzl3"
npm run dev
```

The application will run at the local URL provided by Vite, usually:

```text id="8pq1c9"
http://localhost:5173
```

## Backend API

This frontend connects to the Paddlein Backend API.

Backend repository:

https://github.com/SyalisaAmani/paddlein-backend

Configure the API base URL in the frontend API service before running the application.

## Build

Create a production build:

```bash id="w6m9g2"
npm run build
```

Preview the production build:

```bash id="4v6c1s"
npm run preview
```

## Project Status

Frontend core development completed.

## Author

**Syalisa Amani Fatiha**

GitHub: [@SyalisaAmani](https://github.com/SyalisaAmani)
