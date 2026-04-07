import React, { useState, useEffect, useRef } from 'react';
import './TypingTestBase.css';

const SAMPLE_TEXT = "The quick brown fox jumps over the lazy dog. Programming in React is a highly rewarding experience once you master the fundamental concepts of state, props, and side effects.";

export default function TypingTestBase() {
    const [userInput, setUserInput] = useState('');
    const [timeLeft, setTimeLeft] = useState(60);
    const [isActive, setIsActive] = useState(false);
    const [hasFinished, setHasFinished] = useState(false);

    const inputRef = useRef(null);

    // Timer countdown logic
    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((time) => time - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(interval);
            setIsActive(false);
            setHasFinished(true);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    // Auto-focus the hidden input when the component loads
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    // Handle keystrokes
    const handleInputChange = (e) => {
        if (hasFinished) return;

        const val = e.target.value;

        // Prevent typing past the end of the target text
        if (val.length > SAMPLE_TEXT.length) return;

        // Start timer on first keystroke
        if (!isActive && val.length > 0) {
            setIsActive(true);
        }

        setUserInput(val);

        // End test early if they finish the entire paragraph
        if (val.length === SAMPLE_TEXT.length) {
            setIsActive(false);
            setHasFinished(true);
        }
    };

    const restartTest = () => {
        setUserInput('');
        setTimeLeft(60);
        setIsActive(false);
        setHasFinished(false);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    // Math & Real-time Calculations
    let correctChars = 0;
    const characters = SAMPLE_TEXT.split('');

    // Map over the target text to colorize it based on user input
    const textDisplay = characters.map((char, index) => {
        let colorClass = 'pending';

        if (index < userInput.length) {
            if (char === userInput[index]) {
                colorClass = 'correct';
                correctChars++;
            } else {
                colorClass = 'incorrect';
            }
        }

        // Render a blinking cursor on the current character
        const isCursor = index === userInput.length;

        return (
            <span key={index} className={`char ${colorClass} ${isCursor && !hasFinished ? 'cursor' : ''}`}>
                {char}
            </span>
        );
    });

    const timeElapsed = 60 - timeLeft;
    const minutesElapsed = timeElapsed / 60;

    // Standard WPM formula: (Correct Chars / 5) / Minutes
    const wpm = minutesElapsed > 0
        ? Math.round((correctChars / 5) / minutesElapsed)
        : 0;

    // Standard Accuracy formula: (Correct Chars / Total Typed Chars) * 100
    const accuracy = userInput.length > 0
        ? Math.round((correctChars / userInput.length) * 100)
        : 100;

    return (
        <div className="typing-test-container">
            <h1>Typing Speed Analyzer</h1>

            <div className="stats-board">
                <div className="stat">
                    <span className="label">Time</span>
                    <span className="value">{timeLeft}s</span>
                </div>
                <div className="stat">
                    <span className="label">WPM</span>
                    <span className="value">{wpm}</span>
                </div>
                <div className="stat">
                    <span className="label">Accuracy</span>
                    <span className="value">{accuracy}%</span>
                </div>
            </div>

            {/* Clicking anywhere in the text area refocuses the hidden input */}
            <div className="text-display" onClick={() => inputRef.current.focus()}>
                {textDisplay}
            </div>

            <input
                type="text"
                ref={inputRef}
                value={userInput}
                onChange={handleInputChange}
                disabled={hasFinished}
                className="hidden-input"
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck="false"
            />

            {hasFinished && (
                <div className="results-modal">
                    <h2>Test Complete!</h2>
                    <p>Final WPM: <strong>{wpm}</strong></p>
                    <p>Final Accuracy: <strong>{accuracy}%</strong></p>
                </div>
            )}

            <button className="restart-btn" onClick={restartTest}>
                Restart Test
            </button>
        </div>
    );
}
