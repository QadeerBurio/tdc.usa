import React from 'react';

// Custom SVGs for brands not present in standard FontAwesome or needing high fidelity rendering
const NextjsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 128 128" style={{ fill: '#000', display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64c22.2 0 41.7-11.3 53.2-28.4L58.5 35.8c-2.3-3-6.9-3-9.2 0L24.8 68.3c-1.9 2.5-1.9 6 0 8.5l3.5 4.5c1.9 2.5 5.1 2.5 7.1 0l21-27.1L101 106.6C117.4 96.2 128 77.8 128 57c0-31.5-25.6-57-57-57z"/>
    <path d="M106.6 37.3V82c0 2.5 2 4.5 4.5 4.5s4.5-2 4.5-4.5V37.3c0-2.5-2-4.5-4.5-4.5s-4.5 2-4.5 4.5z" />
  </svg>
);

const TypescriptIcon = () => (
  <svg width="14" height="14" viewBox="0 0 100 100" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <rect width="100" height="100" fill="#3178c6" rx="10"/>
    <text x="50" y="70" fill="white" fontSize="48" fontWeight="bold" fontFamily="Arial, sans-serif" textAnchor="middle">TS</text>
  </svg>
);

const ExpressIcon = () => (
  <svg width="14" height="14" viewBox="0 0 128 128" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <circle cx="64" cy="64" r="60" fill="#333" />
    <text x="64" y="76" fill="#fff" fontSize="38" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">ex</text>
  </svg>
);

const PostgresqlIcon = () => (
  <svg width="14" height="14" viewBox="0 0 128 128" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path fill="#336791" d="M117.8 56c.4-3.5-3.3-8.8-10.4-12.7-7.4-4-15.6-6-23.7-6.2-7.1-.1-12.7 1.4-14.7 2.1-2.1-1.3-4.7-2.3-7.5-3.1-6.1-1.6-11.9-1.9-16.7-1.1-6 1-10.9 3.5-14.2 7.1-1.8 1.9-3.2 4.2-4.1 6.8-1 2.8-1.5 5.9-1.5 9.2 0 7.8 2.7 15.6 7.6 22 4.3 5.6 10 10.2 16.6 13.5v7.2c0 1.2.6 2.3 1.6 3l16.1 10.7c.6.4 1.3.6 2 .6h3.4c2.2 0 4-1.8 4-4v-4.6c1 .4 2.1.8 3.2 1.1 5.9 1.6 11.9 1.9 16.7 1.1 6-1 10.9-3.5 14.2-7.1 1.8-1.9 3.2-4.2 4.1-6.8 1-2.8 1.5-5.9 1.5-9.2 0-7.7-2.7-15.5-7.6-21.9z"/>
  </svg>
);

const MysqlIcon = () => (
  <svg width="14" height="14" viewBox="0 0 128 128" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path fill="#00758F" d="M12.2 60.1c0-11.4 12.9-20.9 31.8-24.8l2-7.5c-22.1 4.5-38.3 15.6-38.3 28.5v32.9c0 10.9 11.6 20.3 28.2 24.5l1.6-7.6c-13.8-3.4-23.5-11.2-23.5-16.9V60.1zm43.1 36.6c0 5.7-9.7 13.5-23.5 16.9l1.6 7.6C50 117 61.6 107.6 61.6 96.7V63.8c0-12.9-16.2-24-38.3-28.5l2 7.5c18.9 3.9 31.8 13.4 31.8 24.8v29.1z"/>
  </svg>
);

const AzureIcon = () => (
  <svg width="14" height="14" viewBox="0 0 128 128" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path fill="#0078d4" d="M10 90L50 10l30 30-70 50zm60-80l48 80H42L70 10z"/>
  </svg>
);

const KubernetesIcon = () => (
  <svg width="14" height="14" viewBox="0 0 128 128" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path fill="#326ce5" d="M64 4L14 34v60l50 30 50-30V34z"/>
  </svg>
);

const FlutterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 128 128" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path fill="#02569B" d="M72.9 2L17.7 57.2l16.5 16.5L89.4 2z"/>
    <path fill="#0175C2" d="M89.4 61.2L72.9 77.7 56.4 94.2l16.5 16.5 39.3-39.3z"/>
    <path fill="#29B6F6" d="M72.9 77.7L89.4 61.2l22.8 22.8-16.5 16.5z"/>
  </svg>
);

const DjangoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 128 128" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <circle cx="64" cy="64" r="60" fill="#092e20"/>
    <text x="64" y="80" fill="white" fontSize="48" fontWeight="bold" fontFamily="Georgia, serif" textAnchor="middle">dj</text>
  </svg>
);

const DartIcon = () => (
  <svg width="14" height="14" viewBox="0 0 128 128" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path fill="#00c4b4" d="M64 4L12 34v60l52 30 52-30V34z"/>
    <path fill="#01579b" d="M64 12L22 36v56l42 24 42-24V36z"/>
    <path fill="#00b0ff" d="M64 24L34 41v46l30 17 30-17V41z"/>
  </svg>
);

const TailwindIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" style={{ fill: '#38bdf8', display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/>
  </svg>
);

const GraphqlIcon = () => (
  <svg width="14" height="14" viewBox="0 0 400 400" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path fill="#e10098" d="M57.4 303.4l-7-12.1 190.8-330.5 14 8.1z"/>
    <path fill="#e10098" d="M342.6 303.4L137.8 349l-7-12.1 190.8-330.5z"/>
    <path fill="#e10098" d="M200 56.6L57.4 303.4h14L200 72.8z"/>
    <path fill="#e10098" d="M200 343.4L57.4 96.6l12-6.9 130.6 226z"/>
    <path fill="#e10098" d="M342.6 96.6L200 343.4v-16.2l130.6-226.1z"/>
    <circle cx="200" cy="40" r="28" fill="#e10098"/>
    <circle cx="360" cy="316" r="28" fill="#e10098"/>
    <circle cx="40" cy="316" r="28" fill="#e10098"/>
    <circle cx="200" cy="200" r="44" fill="#e10098"/>
  </svg>
);

const RedisIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" style={{ display: 'inline-block', verticalAlign: 'middle', fill: '#d82c20' }}>
    <path d="M12 2L2 6.5v11L12 22l10-4.5v-11L12 2zm8 5.3L12 11 4 7.3V6.2l8-3.6 8 3.6v1.1zm-8 4.7l8-3.6v4.6l-8 3.6v-4.6z"/>
  </svg>
);

const SpringBootIcon = () => (
  <svg width="14" height="14" viewBox="0 0 128 128" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path fill="#6DB33F" d="M116.4 55.4C108 30.5 81.3 12 55.4 12c-5.7 0-11.4.9-17 2.7 1.8 1.4 3.7 3 5.4 4.8 21.6 22.3 22.3 54.9.4 77.2-12.8 13.2-30.8 19.3-44.2 19.3 6 5.6 13.9 9.3 22.6 10.3 35.8 4 70.8-21 93.8-70.9z"/>
    <path fill="#ffff" d="M38.8 89.2c-5.8 0-11.4-1.2-16.7-3.6 15.6-3.8 28.5-14.8 35.3-30 6.6-14.8 4.8-31.2-4.9-44.2 1.4-.4 2.8-.7 4.2-.7 19.6 0 38.6 13.6 45 32.5 6.4 18.9-2.3 39.8-20.2 49-11.4 6-27.4 7-42.7 7z"/>
  </svg>
);

export const getTechIcon = (techName) => {
  const lower = techName.trim().toLowerCase();
  
  switch (lower) {
    case 'react':
    case 'react native':
    case 'reactnative':
      return <i className="fa-brands fa-react" style={{ color: '#61dafb' }}></i>;
    case 'node.js':
    case 'nodejs':
    case 'node':
      return <i className="fa-brands fa-node-js" style={{ color: '#339933' }}></i>;
    case 'mongodb':
    case 'mongo':
      return <i className="fa-solid fa-leaf" style={{ color: '#47a248' }}></i>;
    case 'next.js':
    case 'nextjs':
    case 'next':
      return <NextjsIcon />;
    case 'javascript':
    case 'js':
      return <i className="fa-brands fa-js" style={{ color: '#f7df1e' }}></i>;
    case 'typescript':
    case 'ts':
      return <TypescriptIcon />;
    case 'express':
    case 'express.js':
    case 'expressjs':
      return <ExpressIcon />;
    case 'postgresql':
    case 'postgres':
      return <PostgresqlIcon />;
    case 'mysql':
      return <MysqlIcon />;
    case 'firebase':
      return <i className="fa-solid fa-fire" style={{ color: '#ffca28' }}></i>;
    case 'aws':
      return <i className="fa-brands fa-aws" style={{ color: '#ff9900' }}></i>;
    case 'azure':
      return <AzureIcon />;
    case 'docker':
      return <i className="fa-brands fa-docker" style={{ color: '#2496ed' }}></i>;
    case 'kubernetes':
    case 'k8s':
      return <KubernetesIcon />;
    case 'flutter':
      return <FlutterIcon />;
    case 'python':
      return <i className="fa-brands fa-python" style={{ color: '#3776ab' }}></i>;
    case 'django':
      return <DjangoIcon />;
    case 'laravel':
      return <i className="fa-brands fa-laravel" style={{ color: '#ff2d20' }}></i>;
    case 'git':
      return <i className="fa-brands fa-git-alt" style={{ color: '#f05032' }}></i>;
    case 'github':
      return <i className="fa-brands fa-github" style={{ color: '#181717' }}></i>;
    case 'dart':
      return <DartIcon />;
    case 'php':
      return <i className="fa-brands fa-php" style={{ color: '#777bb4' }}></i>;
    case 'java':
      return <i className="fa-brands fa-java" style={{ color: '#007396' }}></i>;
    case 'spring boot':
    case 'springboot':
      return <SpringBootIcon />;
    case 'redis':
      return <RedisIcon />;
    case 'graphql':
      return <GraphqlIcon />;
    case 'tailwind css':
    case 'tailwind':
    case 'tailwindcss':
      return <TailwindIcon />;
    default:
      return null;
  }
};

export const renderTechBadge = (tech) => {
  const name = tech.trim();
  const icon = getTechIcon(name);
  
  return (
    <span className="tech-badge" key={name}>
      {icon && <span className="tech-badge-icon">{icon}</span>}
      <span className="tech-badge-name">{name}</span>
    </span>
  );
};
