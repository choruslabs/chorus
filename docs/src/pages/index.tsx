import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <h1 className={styles.heroHeadline}>
          Find common ground in your community
        </h1>
        <p className={styles.heroSubtitle}>
          Chorus is an open-source tool for collecting opinions and finding
          consensus at scale.
        </p>
        <div className={styles.heroActions}>
          <Link className={styles.btnPrimary} to="/docs/overview">
            Learn more
          </Link>
          <Link
            className={styles.btnSecondary}
            to="https://github.com/choruslabs/chorus">
            GitHub
          </Link>
        </div>
      </div>
    </section>
  );
}

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Collect statements',
    body: 'People submit short statements about a topic.',
  },
  {
    step: '02',
    title: 'Vote',
    body: "People vote agree, disagree, or pass on each other's statements. No threading, no replies.",
  },
  {
    step: '03',
    title: 'See the shape of opinion',
    body: 'Groups of similar opinions emerge. See where these groups differ, and where they find common ground.',
  },
];

function HowItWorks() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionInner}>
        <h2 className={styles.sectionTitle}>How it works</h2>
        <p className={styles.sectionLead}>
          Chorus implements a{' '}
          <a href="https://pol.is" target="_blank" rel="noopener noreferrer">
            pol.is
          </a>
          -style process: collect statements, let people vote, and then see
          where groups who think differently about the topic agree.
        </p>
        <div className={styles.steps}>
          {HOW_IT_WORKS.map(({ step, title, body }) => (
            <div key={step} className={styles.step}>
              <span className={styles.stepNumber}>{step}</span>
              <h3 className={styles.stepTitle}>{title}</h3>
              <p className={styles.stepBody}>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GetInvolved() {
  return (
    <section className={`${styles.section} ${styles.sectionAlt}`}>
      <div className={styles.sectionInner}>
        <h2 className={styles.sectionTitle}>Get involved</h2>
        <p className={styles.sectionLead}>
          Chorus is actively developed on a fully volunteer basis. Contributions
          are welcome — whether that's code, design, documentation, or feedback.
        </p>
        <div className={styles.involvedGrid}>
          <div className={styles.involvedCard}>
            <h3>Found a bug or have an idea?</h3>
            <p>Open an issue on GitHub.</p>
            <Link to="https://github.com/choruslabs/chorus/issues">
              Open an issue →
            </Link>
          </div>
          <div className={styles.involvedCard}>
            <h3>Want to contribute but not sure where to start?</h3>
            <p>
              The GitHub Discussions page is the best place to introduce
              yourself and ask what's needed.
            </p>
            <Link to="https://github.com/choruslabs/chorus/discussions">
              Join the discussion →
            </Link>
          </div>
          <div className={styles.involvedCard}>
            <h3>Curious about the broader problem space?</h3>
            <p>
              The Chorus team originally met at Civic Tech Toronto.
            </p>
            <Link to="https://civictech.ca">Civic Tech Toronto →</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="Large-scale deliberation"
      description="Chorus is an open-source tool for collecting opinions and finding consensus at scale.">
      <main>
        <HeroSection />
        <HowItWorks />
        <GetInvolved />
      </main>
    </Layout>
  );
}
