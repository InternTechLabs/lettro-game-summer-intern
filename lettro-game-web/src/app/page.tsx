'use client';
import React, { useState, useEffect } from 'react';
import Header from '../components/ui/header/Header';
import HeroSection from '../components/ui/header/HeroSection';
import GameSetupForm from '../components/ui/GameSetupForm';
import LoginPage from './signin/page';
import GameModes from '@/components/ui/GameModes';
import CreatePrivateRoom from './room/page';
import DrawMasterGame from './play/page';


export default function GameApp() {
  const [currentView, setCurrentView] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setCurrentView('home');
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setCurrentView('home');
  };

  const handleLoginClick = () => {
    setCurrentView('login');
  };

  const handleStartGame = () => {
    if (!isLoggedIn) {
      alert('🔐 Veuillez vous connecter pour commencer le jeu!');
      setCurrentView('login');
      return;
    }
    setCurrentView('drawmaster');
  };

  const handleDiscoverModes = () => {
    setCurrentView('modes');
  };

  const handleCreatePrivateRoom = () => {
    if (!isLoggedIn) {
      alert('🔐 Veuillez vous connecter pour créer une salle privée!');
      setCurrentView('login');
      return;
    }
    
    setCurrentView('createRoom');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  const backgroundStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #fef3ff 0%, #fce7f3 25%, #f3e8ff 50%, #e0e7ff 75%, #fef3ff 100%)',
    position: 'relative',
    overflow: 'hidden'
  };

  const decorativeElementsStyle = {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    pointerEvents: 'none'
  };

  const mainStyle = {
    position: 'relative',
    zIndex: 10,
    paddingTop: currentView === 'login' || currentView === 'drawmaster' || currentView === 'createRoom' ? '0' : '80px'
  };

  // Page de connexion
  if (currentView === 'login') {
    return (
      <LoginPage 
        onLogin={handleLogin} 
        onBack={handleBackToHome}
      />
    );
  }

  // Page de jeu DrawMaster
  if (currentView === 'drawmaster') {
    return (
      <DrawMasterGame 
        onBackToHome={handleBackToHome}
        user={user}
      />
    );
  }

  // Page de création de salle privée
  if (currentView === 'createRoom') {
    return (
      <CreatePrivateRoom 
        onBackToHome={handleBackToHome}
        user={user}
      />
    );
  }

  return (
    <div style={backgroundStyle}>
      {/* Éléments décoratifs animés */}
      <div style={decorativeElementsStyle}>
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '200px',
          height: '200px',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'float 8s ease-in-out infinite'
        }}></div>
        
        <div style={{
          position: 'absolute',
          bottom: '20%',
          right: '15%',
          width: '150px',
          height: '150px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
          borderRadius: '50%',
          filter: 'blur(50px)',
          animation: 'float 6s ease-in-out infinite reverse'
        }}></div>

        {/* Effet de curseur qui suit la souris */}
        <div style={{
          position: 'absolute',
          left: mousePosition.x - 100,
          top: mousePosition.y - 100,
          width: '200px',
          height: '200px',
          

          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          transition: 'all 0.1s ease',
          pointerEvents: 'none'
        }}></div>
      </div>

      {/* Header */}
      <Header 
        onLoginClick={handleLoginClick}
        isLoggedIn={isLoggedIn}
        user={user}
        onLogout={handleLogout}
      />
    
      <main style={mainStyle}>
        {currentView === 'home' && (
          <>
            <HeroSection 
              isLoggedIn={isLoggedIn} 
              userName={user?.name}
            />
            <div style={{ padding: '0 32px 64px' }}>
              <GameSetupForm 
                onStartGame={handleStartGame}
                onDiscoverModes={handleDiscoverModes}
                onCreatePrivateRoom={handleCreatePrivateRoom}
                user={user}
              />
            </div>
          </>
        )}
        
        {currentView === 'modes' && (
          <div style={{ padding: '32px 32px 64px' }}>
            <GameModes onBack={handleBackToHome} />
          </div>
        )}
      </main>
    </div>
  );
}