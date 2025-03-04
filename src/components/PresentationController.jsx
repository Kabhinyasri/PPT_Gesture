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
    RotateCw
} from 'lucide-react';
import './PresentationController.css';

const PresentationController = () => {
    const [currentSlide, setCurrentSlide] = useState(1);
    const [totalSlides, setTotalSlides] = useState(15);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isPresenting, setIsPresenting] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(100);

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
        } else if (direction === 'left' && currentSlide > 1) {
            setCurrentSlide(prev => prev - 1);
        }
    };

    const handleZoom = (action) => {
        if (action === 'in' && zoomLevel < 200) {
            setZoomLevel(prev => prev + 10);
        } else if (action === 'out' && zoomLevel > 50) {
            setZoomLevel(prev => prev - 10);
        }
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

                    <div className="slide-info">
                        <span className="slide-counter">Slide {currentSlide} / {totalSlides}</span>
                    </div>
                </div>

                <div className="gesture-control-section">
                    <div className="navigation-buttons">
                        {/* Left Swipe (Previous Slide) */}
                        <button
                            className="gesture-button left-swipe"
                            onClick={() => handleNavigation('left')}
                            disabled={currentSlide === 1}
                        >
                            <RotateCcw className="gesture-icon" />
                            <span>Left Swipe</span>
                        </button>

                        {/* Switch to Previous Tab */}
                        <button
                            className="gesture-button switch-tab-left"
                            onClick={() => console.log("Switching to Previous Tab")}
                        >
                            <ArrowLeft className="gesture-icon" />
                            <span>Switch Tab Left</span>
                        </button>

                        {/* Switch to Next Tab */}
                        <button
                            className="gesture-button switch-tab-right"
                            onClick={() => console.log("Switching to Next Tab")}
                        >
                            <ArrowRight className="gesture-icon" />
                            <span>Switch Tab Right</span>
                        </button>

                        {/* Right Swipe (Next Slide) */}
                        <button
                            className="gesture-button right-swipe"
                            onClick={() => handleNavigation('right')}
                            disabled={currentSlide === totalSlides}
                        >
                            <RotateCw className="gesture-icon" />
                            <span>Right Swipe</span>
                        </button>
                    </div>


                    <div className="control-actions">
                        <div className="zoom-controls">
                            <button
                                onClick={() => handleZoom('out')}
                                className="zoom-button zoom-out"
                            >
                                <ZoomOut />
                                <span>Zoom Out</span>
                            </button>

                            <span className="zoom-level">{zoomLevel}%</span>

                            <button
                                onClick={() => handleZoom('in')}
                                className="zoom-button zoom-in"
                            >
                                <ZoomIn />
                                <span>Zoom In</span>
                            </button>
                        </div>

                        <button
                            className="presentation-toggle"
                            onClick={() => setIsPresenting(!isPresenting)}
                        >
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
                    </div>
                </div>

                <div className="progress-container">
                    <div
                        className="progress-bar"
                        style={{
                            width: `${(currentSlide / totalSlides) * 100}%`
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default PresentationController;