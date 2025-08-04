'use client';
import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: (userData: any) => void;
  onBack: () => void;
}

export default function LoginPage({ onLogin, onBack }: LoginPageProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulation d'une connexion
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Données utilisateur fictives basées sur l'email
    const userData = {
      name: formData.email.split('@')[0],
      email: formData.email,
      avatar: '🎮'
    };
    
    setIsLoading(false);
    onLogin(userData);
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(25px)',
    borderRadius: '28px',
    padding: '48px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
    maxWidth: '480px',
    margin: '0 auto',
    position: 'relative',
    overflow: 'hidden',
    animation: 'cardFloat 6s ease-in-out infinite'
  };

  const inputStyle = {
    width: '100%',
    padding: '18px 24px',
    border: '2px solid rgba(139, 92, 246, 0.2)',
    borderRadius: '16px',
    fontSize: '16px',
    background: 'rgba(255, 255, 255, 0.9)',
    transition: 'all 0.3s ease',
    outline: 'none',
    marginBottom: '20px',
    boxSizing: 'border-box' as const
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px',
      background: 'linear-gradient(135deg, #fef3ff 0%, #fce7f3 25%, #f3e8ff 50%, #e0e7ff 75%, #fef3ff 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Éléments décoratifs animés */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '15%',
        width: '100px',
        height: '100px',
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite',
        filter: 'blur(40px)'
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '20%',
        width: '150px',
        height: '150px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite reverse',
        filter: 'blur(50px)'
      }}></div>

      <div style={cardStyle}>
        {/* Effet de particules magiques */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 40%, rgba(139, 92, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
          animation: 'particleMove 10s ease-in-out infinite',
          pointerEvents: 'none'
        }}></div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              fontSize: '64px',
              marginBottom: '16px',
              animation: 'bounce 2s ease-in-out infinite'
            }}>
              🎮
            </div>
            
            <h2 style={{
              fontSize: '32px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #1f2937 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '8px'
            }}>
              Connexion
            </h2>
            
            <p style={{
              color: 'rgba(55, 65, 81, 0.7)',
              fontSize: '16px'
            }}>
              Connectez-vous pour accéder à vos jeux
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151'
              }}>
                📧 Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="votre.email@exemple.com"
                style={inputStyle}
                required
                onFocus={(e) => {
                  e.target.style.borderColor = '#8b5cf6'
                  e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(139, 92, 246, 0.2)'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151'
              }}>
                🔒 Mot de passe
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="••••••••"
                style={inputStyle}
                required
                onFocus={(e) => {
                  e.target.style.borderColor = '#8b5cf6'
                  e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(139, 92, 246, 0.2)'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '32px'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#374151'
              }}>
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                  style={{
                    marginRight: '8px',
                    transform: 'scale(1.2)',
                    accentColor: '#8b5cf6'
                  }}
                />
                Se souvenir de moi
              </label>
              
              <a href="#" style={{
                fontSize: '14px',
                color: '#8b5cf6',
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                Mot de passe oublié?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                background: isLoading 
                  ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                  : 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                color: 'white',
                border: 'none',
                padding: '18px 24px',
                borderRadius: '16px',
                fontSize: '18px',
                fontWeight: '700',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                width: '100%',
                marginBottom: '16px',
                boxShadow: isLoading 
                  ? '0 4px 15px rgba(156, 163, 175, 0.3)'
                  : '0 10px 25px rgba(139, 92, 246, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(-2px) scale(1.02)'
                  e.target.style.boxShadow = '0 15px 35px rgba(139, 92, 246, 0.4)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(0) scale(1)'
                  e.target.style.boxShadow = '0 10px 25px rgba(139, 92, 246, 0.3)'
                }
              }}
            >
              {isLoading ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '3px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '3px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Connexion...
                </>
              ) : (
                <>
                  🚀 Se connecter
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onBack}
              style={{
                background: 'rgba(139, 92, 246, 0.1)',
                color: '#8b5cf6',
                border: '2px solid rgba(139, 92, 246, 0.3)',
                padding: '16px 24px',
                borderRadius: '16px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                width: '100%'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(139, 92, 246, 0.2)'
                e.target.style.transform = 'translateY(-2px) scale(1.02)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(139, 92, 246, 0.1)'
                e.target.style.transform = 'translateY(0) scale(1)'
              }}
            >
              ← Retour à l'accueil
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}