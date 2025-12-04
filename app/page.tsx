'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDownload, FiUpload, FiExternalLink } from 'react-icons/fi';
import styles from './page.module.css';

// Letter morphing component that rotates through options with letter-by-letter animation
function RotatingText({ options, className }: { options: string[]; className?: string }) {
  // Start at a random index to avoid always showing the first option
  const [currentIndex, setCurrentIndex] = useState(() => Math.floor(Math.random() * options.length));
  const [previousIndex, setPreviousIndex] = useState(currentIndex);

  useEffect(() => {
    const interval = setInterval(() => {
      setPreviousIndex(currentIndex);
      setCurrentIndex((prev) => (prev + 1) % options.length);
    }, 600); // Change faster - every 600ms

    return () => clearInterval(interval);
  }, [currentIndex, options.length]);

  const currentText = options[currentIndex] || options[0];
  const previousText = options[previousIndex] || options[0];
  const maxLength = Math.max(currentText.length, previousText.length);

  return (
    <span className={className} style={{ display: 'inline-block' }}>
      {Array.from({ length: maxLength }).map((_, i) => {
        const currentChar = currentText[i] || ' ';
        const previousChar = previousText[i] || ' ';
        const isChanging = currentChar !== previousChar;

        return (
          <motion.span
            key={`${currentIndex}-${i}`}
            initial={isChanging ? { 
              opacity: 0, 
              y: 20, 
              rotateX: -90,
              scale: 0.8
            } : { opacity: 1, y: 0, rotateX: 0, scale: 1 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              rotateX: 0,
              scale: 1
            }}
            transition={{ 
              duration: 0.4,
              delay: i * 0.03,
              ease: "easeOut"
            }}
            style={{ 
              display: 'inline-block',
              transformStyle: 'preserve-3d',
              whiteSpace: currentChar === ' ' ? 'pre' : 'normal'
            }}
          >
            {currentChar === ' ' ? '\u00A0' : currentChar}
          </motion.span>
        );
      })}
    </span>
  );
}

interface Selection {
  input: {
    category: string;
    item: string;
    library: string;
    link: string;
    full: string;
  };
  output: {
    category: string;
    item: string;
    library: string;
    link: string;
    full: string;
  };
}

export default function Home() {
  const [selection, setSelection] = useState<Selection | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingSelection, setLoadingSelection] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputOptions = [
    'GPS coordinates',
    'Heart rate data',
    'Step count',
    'Location accuracy',
    'Device orientation',
    'Battery level',
    'Music playback',
    'Calendar events',
    'Weather data',
    'Activity recognition',
  ];

  const outputOptions = [
    'Push notification',
    'Home screen widget',
    'Dynamic Island',
    'Haptic feedback',
    'Calendar event',
    'Siri shortcut',
    'Watch complication',
    'Text-to-speech',
    'App badge',
    'Live activity',
  ];

  const libraryOptions = [
    'Core Location',
    'HealthKit',
    'CoreMotion',
    'EventKit',
    'WidgetKit',
    'ActivityKit',
    'UserNotifications',
    'CoreHaptics',
    'App Intents',
    'PhotoKit',
  ];

  const getRandomSelection = async () => {
    setLoadingSelection(true);
    setError(null);
    setResponse(null);
    // Keep previous selection visible during animation, don't clear it yet
    
    try {
      const res = await fetch('/api/random');
      if (!res.ok) throw new Error('Failed to get random selection');
      const data = await res.json();
      // Add a small delay to ensure animation is visible
      await new Promise(resolve => setTimeout(resolve, 800));
      setSelection(data);
    } catch (err: any) {
      setError(err.message || 'Failed to get random selection');
    } finally {
      setLoadingSelection(false);
    }
  };

  const generateExperience = async () => {
    if (!selection) return;
    
    setLoading(true);
    setError(null);
    setResponse(null);
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: selection.input.full,
          output: selection.output.full,
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to generate experience');
      }
      
      const data = await res.json();
      setResponse(data.response);
    } catch (err: any) {
      setError(err.message || 'Failed to generate experience');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>iOS Experience Generator</h1>
        <p className={styles.subtitle}>
          Connect random iOS inputs and outputs to create unique app experiences
        </p>

        <div className={styles.actions}>
          <button
            onClick={getRandomSelection}
            disabled={loading || loadingSelection}
            className={styles.circleButton}
            aria-label="Get Random Selection"
          >
            <span className={styles.circleButtonText}>Get Random</span>
          </button>
        </div>

        <div className={styles.selection}>
          <div className={styles.cardWrapper}>
            <div className={styles.cardLabel}>
              <FiDownload className={`${styles.cardIcon} ${!selection && !loadingSelection ? styles.cardIconDisabled : ''}`} />
              <span className={!selection && !loadingSelection ? styles.cardLabelDisabled : ''}>Input</span>
            </div>
            <div className={`${styles.card} ${!selection && !loadingSelection ? styles.cardDisabled : ''}`}>
              {loadingSelection ? (
                <>
                  <h3 className={styles.cardItem}>
                    <RotatingText options={inputOptions} />
                  </h3>
                  <div className={styles.cardFooter}>
                    <span className={styles.cardLibrary}>
                      <RotatingText options={libraryOptions} />
                    </span>
                    <span className={styles.cardLinkPlaceholder}>
                      <FiExternalLink />
                    </span>
                  </div>
                </>
              ) : !selection ? (
                <>
                  <h3 className={styles.cardItemPlaceholder}>Select an input capability</h3>
                  <div className={styles.cardFooter}>
                    <span className={styles.cardLibraryPlaceholder}>Library name</span>
                    <span className={styles.cardLinkPlaceholder}>
                      <FiExternalLink />
                    </span>
                  </div>
                </>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selection.input.item}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className={styles.cardItem}>{selection.input.item}</h3>
                    <a 
                      href={selection.input.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.cardFooterLink}
                    >
                      <div className={styles.cardFooter}>
                        <span className={styles.cardLibrary}>{selection.input.library}</span>
                        <FiExternalLink className={styles.cardLinkIcon} />
                      </div>
                    </a>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>

          <div className={styles.arrow}>→</div>

          <div className={styles.cardWrapper}>
            <div className={styles.cardLabel}>
              <FiUpload className={`${styles.cardIcon} ${!selection && !loadingSelection ? styles.cardIconDisabled : ''}`} />
              <span className={!selection && !loadingSelection ? styles.cardLabelDisabled : ''}>Output</span>
            </div>
            <div className={`${styles.card} ${!selection && !loadingSelection ? styles.cardDisabled : ''}`}>
              {loadingSelection ? (
                <>
                  <h3 className={styles.cardItem}>
                    <RotatingText options={outputOptions} />
                  </h3>
                  <div className={styles.cardFooter}>
                    <span className={styles.cardLibrary}>
                      <RotatingText options={libraryOptions} />
                    </span>
                    <span className={styles.cardLinkPlaceholder}>
                      <FiExternalLink />
                    </span>
                  </div>
                </>
              ) : !selection ? (
                <>
                  <h3 className={styles.cardItemPlaceholder}>Select an output capability</h3>
                  <div className={styles.cardFooter}>
                    <span className={styles.cardLibraryPlaceholder}>Library name</span>
                    <span className={styles.cardLinkPlaceholder}>
                      <FiExternalLink />
                    </span>
                  </div>
                </>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selection.output.item}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className={styles.cardItem}>{selection.output.item}</h3>
                    <a 
                      href={selection.output.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.cardFooterLink}
                    >
                      <div className={styles.cardFooter}>
                        <span className={styles.cardLibrary}>{selection.output.library}</span>
                        <FiExternalLink className={styles.cardLinkIcon} />
                      </div>
                    </a>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            onClick={generateExperience}
            disabled={!selection || loading}
            className={styles.buttonPrimary}
          >
            {loading ? 'Generating...' : 'Generate Experience'}
          </button>
        </div>

        {error && (
          <div className={styles.error}>
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className={styles.response}>
          <h2 className={styles.responseTitle}>Generated Experience</h2>
          <div className={`${styles.responseContent} ${!response ? styles.responseContentEmpty : ''}`}>
            {loading ? (
              <div className={styles.skeleton}>
                <div className={styles.skeletonLine} style={{ width: '100%', height: '16px', marginBottom: '12px' }}></div>
                <div className={styles.skeletonLine} style={{ width: '95%', height: '16px', marginBottom: '12px' }}></div>
                <div className={styles.skeletonLine} style={{ width: '90%', height: '16px' }}></div>
              </div>
            ) : response ? (
              <p className={styles.paragraph}>{response}</p>
            ) : (
              <p className={styles.paragraphPlaceholder}>Generate an experience to see it here</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
