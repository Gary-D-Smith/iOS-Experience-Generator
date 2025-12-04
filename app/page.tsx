'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDownload, FiUpload, FiExternalLink } from 'react-icons/fi';
import styles from './page.module.css';

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

  const getRandomSelection = async () => {
    const previousSelection = selection; // Store previous selection
    setLoadingSelection(true);
    setError(null);
    setResponse(null);
    // Keep previous selection visible during loading - don't clear it
    
    try {
      const res = await fetch('/api/random');
      if (!res.ok) throw new Error('Failed to get random selection');
      const data = await res.json();
      // Only update if we got valid data, and do it atomically
      if (data && data.input && data.output) {
        // Update both states together - React 18+ batches these automatically
        setSelection(data);
        setLoadingSelection(false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to get random selection');
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
              <AnimatePresence mode="wait" initial={false}>
                {!selection ? (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={styles.cardContent}
                  >
                    <h3 className={styles.cardItemPlaceholder}>Select an input capability</h3>
                    <div className={styles.cardFooter}>
                      <span className={styles.cardLibraryPlaceholder}>Library name</span>
                      <span className={styles.cardLinkPlaceholder}>
                        <FiExternalLink />
                      </span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`input-${selection.input.item}-${selection.input.library}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className={styles.cardContent}
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
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className={styles.arrow}>→</div>

          <div className={styles.cardWrapper}>
            <div className={styles.cardLabel}>
              <FiUpload className={`${styles.cardIcon} ${!selection && !loadingSelection ? styles.cardIconDisabled : ''}`} />
              <span className={!selection && !loadingSelection ? styles.cardLabelDisabled : ''}>Output</span>
            </div>
            <div className={`${styles.card} ${!selection && !loadingSelection ? styles.cardDisabled : ''}`}>
              <AnimatePresence mode="wait" initial={false}>
                {!selection ? (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={styles.cardContent}
                  >
                    <h3 className={styles.cardItemPlaceholder}>Select an output capability</h3>
                    <div className={styles.cardFooter}>
                      <span className={styles.cardLibraryPlaceholder}>Library name</span>
                      <span className={styles.cardLinkPlaceholder}>
                        <FiExternalLink />
                      </span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`output-${selection.output.item}-${selection.output.library}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className={styles.cardContent}
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
                )}
              </AnimatePresence>
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
