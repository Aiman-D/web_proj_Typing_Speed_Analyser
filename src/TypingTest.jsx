import React, { useState, useEffect, useRef, useCallback } from 'react';
import './TypingTest.css';

const TEXT_POOL = {
    easy: [
        "The sun rises in the east and sets in the west. Birds sing in the morning and the wind blows through the trees. Life is simple and beautiful if you take the time to notice.",
        "Cats like to sleep in warm places. Dogs enjoy playing fetch in the park. The sky turns pink and orange at sunset. Rain makes the grass grow tall and green.",
        "Reading books opens your mind to new worlds. A good story can take you anywhere. Libraries are full of adventures waiting to be discovered by curious readers.",
    ],
    medium: [
        "The quick brown fox jumps over the lazy dog. Programming in React is a highly rewarding experience once you master the fundamental concepts of state, props, and side effects.",
        "Every great developer you know got there by solving problems they were unqualified to solve until they did it. The best way to learn is to build real things that matter to you.",
        "Consistency is the key to mastery. Writing code every single day, even for just thirty minutes, compounds into extraordinary skill over months and years of deliberate practice.",
    ],
    hard: [
        "Asynchronous JavaScript relies on the event loop, Promises, and the async/await syntax to handle non-blocking I/O operations without freezing the main execution thread of the browser.",
        "The Byzantine Generals Problem is a classic fault-tolerance dilemma in distributed computing where components must agree on a strategy despite potential communication failures and traitors.",
        "Polymorphism, encapsulation, and inheritance are the three pillars of object-oriented programming, enabling developers to write modular, reusable, and maintainable software systems at scale.",
    ],
};

const TIME_OPTIONS = [30, 60, 120];

function getRandomText(difficulty) {
    const pool = TEXT_POOL[difficulty];
    return pool[Math.floor(Math.random() * pool.length)];
}

export default function TypingTest() {
    const [difficulty, setDifficulty] = useState('medium');
    const [selectedTime, setSelectedTime] = useState(60);
    const [sampleText, setSampleText] = useState(() => getRandomText('medium'));

    const [userInput, setUserInput] = useState('');
    const [timeLeft, setTimeLeft] = useState(60);
    const [isActive, setIsActive] = useState(false);
    const [hasFinished, setHasFinished] = useState(false);
    const [history, setHistory] = useState([]);

    const inputRef = useRef(null);

    const focusInput = useCallback(() => {
        inputRef.current?.focus();
    }, []);

    // Timer countdown
    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
        } else if (timeLeft === 0 && isActive) {
            clearInterval(interval);
            setIsActive(false);
            setHasFinished(true);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    // Auto-focus
    useEffect(() => { focusInput(); }, []);

    // Tab to restart
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                restartTest();
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [difficulty, selectedTime]);

    // Save result to history when finished
    useEffect(() => {
        if (hasFinished) {
            const timeElapsed = selectedTime - timeLeft;
            const minutesElapsed = timeElapsed / 60;
            let correctChars = 0;
            for (let i = 0; i < userInput.length; i++) {
                if (userInput[i] === sampleText[i]) correctChars++;
            }
            const wpm = minutesElapsed > 0 ? Math.round((correctChars / 5) / minutesElapsed) : 0;
            const accuracy = userInput.length > 0 ? Math.round((correctChars / userInput.length) * 100) : 100;
            setHistory((prev) => [{ wpm, accuracy, difficulty, time: selectedTime }, ...prev.slice(0, 4)]);
        }
    }, [hasFinished]);

    const handleInputChange = (e) => {
        if (hasFinished) return;
        const val = e.target.value;
        if (val.length > sampleText.length) return;
        if (!isActive && val.length > 0) setIsActive(true);
        setUserInput(val);
        if (val.length === sampleText.length) {
            setIsActive(false);
            setHasFinished(true);
        }
    };

    const restartTest = useCallback(() => {
        const newText = getRandomText(difficulty);
        setSampleText(newText);
        setUserInput('');
        setTimeLeft(selectedTime);
        setIsActive(false);
        setHasFinished(false);
        setTimeout(() => inputRef.current?.focus(), 0);
    }, [difficulty, selectedTime]);

    const handleDifficulty = (d) => {
        setDifficulty(d);
        const newText = getRandomText(d);
        setSampleText(newText);
        setUserInput('');
        setTimeLeft(selectedTime);
        setIsActive(false);
        setHasFinished(false);
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const handleTime = (t) => {
        setSelectedTime(t);
        setUserInput('');
        setTimeLeft(t);
        setIsActive(false);
        setHasFinished(false);
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    // Calculations
    let correctChars = 0;
    const textDisplay = sampleText.split('').map((char, index) => {
        let colorClass = 'pending';
        if (index < userInput.length) {
            if (char === userInput[index]) { colorClass = 'correct'; correctChars++; }
            else colorClass = 'incorrect';
        }
        const isCursor = index === userInput.length;
        return (
            <span key={index} className={`char ${colorClass}${isCursor && !hasFinished ? ' cursor' : ''}`}>
                {char}
            </span>
        );
    });

    const timeElapsed = selectedTime - timeLeft;
    const minutesElapsed = timeElapsed / 60;
    const wpm = minutesElapsed > 0 ? Math.round((correctChars / 5) / minutesElapsed) : 0;
    const accuracy = userInput.length > 0 ? Math.round((correctChars / userInput.length) * 100) : 100;
    const charsRemaining = sampleText.length - userInput.length;
    const progress = (userInput.length / sampleText.length) * 100;

    return (
        <div className="app-wrapper">
            <div className="typing-test-container">

                {/* Header */}
                <div className="logo">Typing Speed <span className="dot">Analyser</span></div>
                <div className="header">
                    <div className="controls">
                        <div className="control-group">
                            {['easy', 'medium', 'hard'].map((d) => (
                                <button
                                    key={d}
                                    className={`control-btn ${difficulty === d ? 'active' : ''}`}
                                    onClick={() => handleDifficulty(d)}
                                    disabled={isActive}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                        <div className="divider" />
                        <div className="control-group">
                            {TIME_OPTIONS.map((t) => (
                                <button
                                    key={t}
                                    className={`control-btn ${selectedTime === t ? 'active' : ''}`}
                                    onClick={() => handleTime(t)}
                                    disabled={isActive}
                                >
                                    {t}s
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="stats-board">
                    <div className="stat">
                        <span className="label">time</span>
                        <span className={`value ${timeLeft <= 10 && isActive ? 'danger' : ''}`}>{timeLeft}s</span>
                    </div>
                    <div className="stat">
                        <span className="label">wpm</span>
                        <span className="value">{wpm}</span>
                    </div>
                    <div className="stat">
                        <span className="label">accuracy</span>
                        <span className="value">{accuracy}%</span>
                    </div>
                    <div className="stat">
                        <span className="label">chars left</span>
                        <span className="value small">{charsRemaining}</span>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                </div>

                {/* Text display */}
                <div className="text-display" onClick={focusInput}>
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

                {/* Results */}
                {hasFinished && (
                    <div className="results-modal">
                        <div className="results-grid">
                            <div className="result-item">
                                <span className="result-label">wpm</span>
                                <span className="result-value">{wpm}</span>
                            </div>
                            <div className="result-item">
                                <span className="result-label">accuracy</span>
                                <span className="result-value">{accuracy}%</span>
                            </div>
                            <div className="result-item">
                                <span className="result-label">difficulty</span>
                                <span className="result-value small-val">{difficulty}</span>
                            </div>
                        </div>
                        {history.length > 1 && (
                            <div className="history">
                                <span className="history-label">recent scores</span>
                                <div className="history-list">
                                    {history.slice(1).map((h, i) => (
                                        <span key={i} className="history-item">{h.wpm} wpm · {h.accuracy}%</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className="footer">
                    <button className="restart-btn" onClick={restartTest}>
                        restart
                    </button>
                    <span className="hint">or press <kbd>Tab</kbd></span>
                </div>

            </div>
        </div>
    );
}