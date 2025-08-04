'use client';
import React, { useState } from 'react';

interface GameSetupFormProps {
  onStartGame: () => void;
  onDiscoverModes: () => void;
  onCreatePrivateRoom: () => void;
  user: any;
}

export default function GameSetupForm({ onStartGame, onDiscoverModes, onCreatePrivateRoom, user }: GameSetupFormProps) {
  const [formData, setFormData] = useState({
    playerName: user?.name || '',
    gameMode: 'classic',
    avatar: user?.avatar || '🎮'
  });

  const avatars = [
    '🎮', '🎨', '🎯', '🚀', '⭐', '🌟', '🎪', '🎭', '🎵', '🏆', 
    '👑', '💎', '🔥', '⚡', '🌈', '🦄', '🐲', '🤖', '👾', '🎸',
    '🎺', '🎷', '🥳', '😎', '🤩', '🥰', '😍', '🤗', '😁', '🎊'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '48px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    margin: '0 auto',
    transition: 'all 0.3s ease',
    position: 'relative' as const,
    overflow: 'hidden' as const
  };

  const inputStyle = {
    width: '100%',
    padding: '16px 20px',
    border: '2px solid rgba(139, 92, 246, 0.2)',
    borderRadius: '16px',
    fontSize: '16px',
    background: 'rgba(255, 255, 255, 0.8)',
    transition: 'all 0.3s ease',
    outline: 'none',
    boxSizing: 'border-box' as const
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer'
  };

  const primaryButtonStyle = {
    background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
    color: 'white',
    border: 'none',
    padding: '18px 36px',
    borderRadius: '16px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 25px rgba(139, 92, 246, 0.3)',
    width: '100%',
    marginBottom: '16px'
  };

  const secondaryButtonStyle = {
    background: 'rgba(139, 92, 246, 0.1)',
    color: '#8b5cf6',
    border: '2px solid rgba(139, 92, 246, 0.3)',
    padding: '16px 36px',
    borderRadius: '16px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    width: '100%',
    marginBottom: '16px'
  };

  const privateRoomButtonStyle = {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    border: 'none',
    padding: '16px 36px',
    borderRadius: '16px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
    width: '100%'
  };

  return (
    <div style={cardStyle}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none'
      }}></div>
      
      <h2 style={{
        fontSize: '32px',
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: '32px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        ✨ Configuration du jeu
      </h2>
      
      <div style={{ marginBottom: '24px', position: 'relative', zIndex: 1 }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '16px',
          fontWeight: '500',
          color: '#374151'
        }}>
          👤 Nom du joueur
        </label>
        <input
          type="text"
          value={formData.playerName}
          onChange={(e) => handleInputChange('playerName', e.target.value)}
          placeholder="Entrez votre nom"
          style={inputStyle}
          onFocus={(e) => {
            e.target.style.borderColor = '#8b5cf6';
            e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(139, 92, 246, 0.2)';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      <div style={{ marginBottom: '24px', position: 'relative', zIndex: 1 }}>
        <label style={{
          display: 'block',
          marginBottom: '12px',
          fontSize: '16px',
          fontWeight: '500',
          color: '#374151'
        }}>
          😀 Avatar
        </label>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(50px, 1fr))',
          gap: '8px',
          maxHeight: '120px',
          overflowY: 'auto',
          padding: '8px',
          background: 'rgba(255, 255, 255, 0.5)',
          borderRadius: '12px',
          border: '1px solid rgba(139, 92, 246, 0.2)'
        }}>
          {avatars.map(avatar => (
            <button
              key={avatar}
              onClick={() => handleInputChange('avatar', avatar)}
              style={{
                padding: '8px',
                borderRadius: '8px',
                border: formData.avatar === avatar 
                  ? '2px solid #8b5cf6' 
                  : '2px solid transparent',
                background: formData.avatar === avatar 
                  ? 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)' 
                  : 'rgba(255, 255, 255, 0.8)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: formData.avatar === avatar ? 'scale(1.1)' : 'scale(1)',
                boxShadow: formData.avatar === avatar ? '0 4px 15px rgba(139, 92, 246, 0.3)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (formData.avatar !== avatar) {
                  e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (formData.avatar !== avatar) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              {avatar}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '32px', position: 'relative', zIndex: 1 }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '16px',
          fontWeight: '500',
          color: '#374151'
        }}>
          🎮 Mode de jeu
        </label>
        <select
          value={formData.gameMode}
          onChange={(e) => handleInputChange('gameMode', e.target.value)}
          style={selectStyle}
          onFocus={(e) => {
            e.target.style.borderColor = '#8b5cf6';
            e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(139, 92, 246, 0.2)';
            e.target.style.boxShadow = 'none';
          }}
        >
          <option value="classic">🎯 Classique</option>
          <option value="adventure">🗺️ Aventure</option>
          <option value="challenge">⚡ Défi</option>
          <option value="multiplayer">👥 Multijoueur</option>
        </select>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <button
          onClick={onStartGame}
          style={primaryButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 15px 35px rgba(139, 92, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(139, 92, 246, 0.3)';
          }}
        >
          🎮 Commencer le jeu
        </button>

        <button
          onClick={onDiscoverModes}
          style={secondaryButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)';
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
          }}
        >
          🔍 Découvrir les modes
        </button>

        <button
          onClick={onCreatePrivateRoom}
          style={privateRoomButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(16, 185, 129, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.3)';
          }}
        >
          🔒 Créer une salle privée
        </button>
      </div>
    </div>
  );
}