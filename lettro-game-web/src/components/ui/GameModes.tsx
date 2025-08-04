'use client';
import React from 'react';

interface GameModesProps {
  onBack: () => void;
}

export default function GameModes({ onBack }: GameModesProps) {
  const modes = [
    {
      id: 'classic',
      title: 'Mode Classique',
      description: 'L\'expérience traditionnelle avec des règles établies',
      icon: '🎯',
      color: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
    },
    {
      id: 'adventure',
      title: 'Mode Aventure',
      description: 'Explorez des mondes fantastiques avec des quêtes épiques',
      icon: '🗺️',
      color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    },
    {
      id: 'challenge',
      title: 'Mode Défi',
      description: 'Testez vos limites avec des défis hardcore',
      icon: '⚡',
      color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
    },
    {
      id: 'multiplayer',
      title: 'Mode Multijoueur',
      description: 'Affrontez vos amis dans des parties endiablées',
      icon: '👥',
      color: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)'
    }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(139, 92, 246, 0.1)',
            color: '#8b5cf6',
            border: '2px solid rgba(139, 92, 246, 0.3)',
            padding: '12px 24px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            marginBottom: '32px'
          }}
        >
          ← Retour
        </button>
        
        <h2 style={{
          fontSize: '3rem',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #1f2937 0%, #8b5cf6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '16px'
        }}>
          Modes de Jeu
        </h2>
        
        <p style={{
          fontSize: '18px',
          color: 'rgba(55, 65, 81, 0.7)',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Choisissez votre style de jeu préféré et plongez dans l'aventure
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '32px',
        padding: '0 16px'
      }}>
        {modes.map((mode) => (
          <div
            key={mode.id}
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative' as const,
              overflow: 'hidden' as const
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
              e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: mode.color
            }}></div>
            
            <div style={{
              fontSize: '48px',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              {mode.icon}
            </div>
            
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '12px',
              textAlign: 'center'
            }}>
              {mode.title}
            </h3>
            
            <p style={{
              fontSize: '16px',
              color: 'rgba(55, 65, 81, 0.7)',
              lineHeight: '1.5',
              textAlign: 'center',
              marginBottom: '24px'
            }}>
              {mode.description}
            </p>
            
            <button style={{
              background: mode.color,
              color: 'white',
              border: 'none',
              padding: '14px 28px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              width: '100%'
            }}>
              Jouer maintenant
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}