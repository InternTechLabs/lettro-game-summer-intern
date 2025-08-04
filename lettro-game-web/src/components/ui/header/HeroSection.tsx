'use client';
import React from 'react';

interface HeroSectionProps {
  isLoggedIn: boolean;
  userName?: string;
}

export default function HeroSection({ isLoggedIn, userName }: HeroSectionProps) {
  return (
    <section style={{
      textAlign: 'center',
      padding: '80px 32px 64px',
      position: 'relative',
      zIndex: 10
    }}>
      <h1 style={{
        fontSize: '4rem',
        fontWeight: '900',
        background: 'linear-gradient(135deg, #1f2937 0%, #8b5cf6 50%, #ec4899 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '24px',
        animation: 'titleGlow 3s ease-in-out infinite'
      }}>
        {isLoggedIn ? `Bienvenue ${userName}!` : 'Bienvenue dans GameHub'}
      </h1>
      
      <p style={{
        fontSize: '20px',
        color: 'rgba(55, 65, 81, 0.8)',
        maxWidth: '600px',
        margin: '0 auto 32px',
        lineHeight: '1.6',
        animation: 'fadeInUp 1s ease-out 0.3s both'
      }}>
        {isLoggedIn 
          ? 'Prêt pour une nouvelle aventure épique? Configurez votre jeu et commencez à jouer!'
          : 'Plongez dans des aventures épiques et créez des souvenirs inoubliables'
        }
      </p>
      
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        animation: 'fadeInUp 1s ease-out 0.6s both'
      }}>
        <span style={{ fontSize: '32px', animation: 'bounce 2s ease-in-out infinite' }}>🎮</span>
        <span style={{ fontSize: '32px', animation: 'bounce 2s ease-in-out infinite 0.2s' }}>✨</span>
        <span style={{ fontSize: '32px', animation: 'bounce 2s ease-in-out infinite 0.4s' }}>🚀</span>
      </div>
    </section>
  );
}