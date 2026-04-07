# Typing Speed Analyser

A web application built with React as part of the Web Programming course (VIT). The app tests and measures typing speed and accuracy in real time, providing instant feedback on performance.

## Features

- **Live WPM tracking** — calculates words per minute as you type using the standard (chars/5)/minutes formula
- **Accuracy measurement** — tracks correct vs total characters typed in real time
- **Difficulty modes** — Easy, Medium, and Hard passages with randomised text on every attempt
- **Configurable timer** — choose between 30, 60, or 120 second sessions
- **Progress bar** — visual indicator of how far through the passage you are
- **Score history** — last 4 results displayed after each completed test
- **Keyboard shortcut** — press `Tab` to instantly restart
- **Color-coded feedback** — correct characters highlight white, errors highlight red with underline
- **Responsive design** — works on both desktop and mobile screens

## Tech Stack

- React (Hooks — useState, useEffect, useRef, useCallback)
- Vite
- CSS3

## Getting Started

```bash
# Clone the repository
git clone https://github.com/Aiman-D/web_proj_Typing_Speed_Analyser.git

# Navigate into the project
cd web_proj_Typing_Speed_Analyser

# Install dependencies
npm install

# Start the development server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── App.jsx
├── TypingTest.jsx
└── TypingTest.css
```

## Team

Developed by a team of 3 as part of the Web Programming course at VIT.
