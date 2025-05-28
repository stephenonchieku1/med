# MediLingo

A modern web application that helps users understand medication information through text search and image analysis.

## Features

- Image upload and text extraction from medication labels
- Text search for medication information
- Comprehensive medication information display:
  - Overview
  - Ingredients
  - Side Effects
  - Herbal Alternatives
- Modern, responsive UI
- Real-time feedback and loading states

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Tesseract.js (OCR)
- React Dropzone
- Axios

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Search by Text**
   - Enter the medication name in the search box
   - Click the search button or press Enter
   - View the detailed information

2. **Search by Image**
   - Drag and drop an image of a medication label
   - Or click to select an image from your device
   - The app will extract text and display information

## Development

The project structure is organized as follows:

- `/app` - Next.js app directory
  - `/api` - API routes
  - `page.tsx` - Main application page
  - `globals.css` - Global styles
- `/public` - Static assets

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT # med-lexai
