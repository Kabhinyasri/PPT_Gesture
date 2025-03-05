import React, { useState, useEffect } from 'react';
import {
    ArrowLeft,
    ArrowRight,
    ZoomIn,
    ZoomOut,
    Clock,
    Play,
    Pause,
    RotateCcw,
    RotateCw,
    RefreshCcw
} 
from 'lucide-react';
import './PresentationController.css';

const PresentationController = () => {
    const [currentSlide, setCurrentSlide] = useState(1);
    const [totalSlides, setTotalSlides] = useState(15);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isPresenting, setIsPresenting] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(100);
    const [mode, setMode] = useState('slide');
    const [slidesMoved, setSlidesMoved] = useState(0);

    useEffect(() => {
        let intervalId;
        if (isPresenting) {
            intervalId = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(intervalId);
    }, [isPresenting]);

    const handleNavigation = (direction) => {
        if (direction === 'right' && currentSlide < totalSlides) {
            setCurrentSlide(prev => prev + 1);
            setSlidesMoved(prev => prev + 1);
        } else if (direction === 'left' && currentSlide > 1) {
            setCurrentSlide(prev => prev - 1);
            setSlidesMoved(prev => prev - 1);
        }
    };

    const handleZoom = (action) => {
        if (action === 'in' && zoomLevel < 200) {
            setZoomLevel(prev => prev + 10);
        } else if (action === 'out' && zoomLevel > 50) {
            setZoomLevel(prev => prev - 10);
        }
    };

    const handleModeChange = async (newMode) => {
        setMode(newMode);
        console.log(`Active mode changed to: ${newMode}`);
        try {
            const response = await fetch('http://localhost:5000/set-mode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode: newMode }),
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error sending mode to backend:', error);
        }
    };

    const resetToDefault = () => {
        setCurrentSlide(1);
        setZoomLevel(100);
        setMode('slide');
        setSlidesMoved(0);
        setElapsedTime(0);
        setIsPresenting(false);

        handleModeChange('default');

    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="presentation-controller-full">
            <div className="controller-content">
                <div className="header-section">
                    <div className="time-display">
                        <Clock className="time-icon" />
                        <span className="time-text">{formatTime(elapsedTime)}</span>
                    </div>
                    <div className="mode-selection">
                        <button onClick={() => handleModeChange('slide')}>Slide Mode</button>
                        <button onClick={() => handleModeChange('pdf')}>PDF Mode</button>
                    </div>
                    <div className="slide-info">
                        <span className="slide-counter">Slide {currentSlide} / {totalSlides}</span>
                        <span className="slides-moved">Slides Moved: {slidesMoved}</span>
                    </div>
                </div>

                <div className="gesture-control-section">
                    <div className="navigation-buttons">
                        <button className="gesture-button left-swipe" onClick={() => handleNavigation('left')} disabled={currentSlide === 1}>
                            <RotateCcw className="gesture-icon" />
                            <span>Left Swipe</span>
                        </button>

                        <button className="gesture-button switch-tab-left">
                            <ArrowRight className="gesture-icon" />
                            <span>Switch Tab</span>
                        </button>

                        <button className="gesture-button right-swipe" onClick={() => handleNavigation('right')} disabled={currentSlide === totalSlides}>
                            <RotateCw className="gesture-icon" />
                            <span>Right Swipe</span>
                        </button>
                    </div>

                    <div className="control-actions">
                        <div className="zoom-controls">
                            <button onClick={() => handleZoom('out')} className="zoom-button zoom-out">
                                <ZoomOut />
                                <span>Zoom Out</span>
                            </button>

                            <span className="zoom-level">{zoomLevel}%</span>

                            <button onClick={() => handleZoom('in')} className="zoom-button zoom-in">
                                <ZoomIn />
                                <span>Zoom In</span>
                            </button>
                        </div>

                        <button className="presentation-toggle" onClick={() => setIsPresenting(!isPresenting)}>
                            {isPresenting ? (
                                <>
                                    <Pause />
                                    <span>Pause</span>
                                </>
                            ) : (
                                <>
                                    <Play />
                                    <span>Start</span>
                                </>
                            )}
                        </button>

                        {/* Default Reset Button */}
                        <button className="default-button" onClick={resetToDefault}>
                            <RefreshCcw />
                            <span>Reset</span>
                        </button>
                    </div>
                </div>

                <div className="progress-container">
                    <div className="progress-bar" style={{ width: `${(currentSlide / totalSlides) * 100}%` }}></div>
                </div>
            </div>
        </div>
    );
};

export default PresentationController;
