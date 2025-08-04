'use client';
import React, { useState, useEffect } from 'react';
import { Users, Settings, Clock, Play, Crown, MessageCircle, Copy, Lock, Globe, ChevronDown, ChevronUp } from 'lucide-react';

interface CreatePrivateRoomProps {
  onBackToHome: () => void;
  user: any;
}

export default function CreatePrivateRoom({ onBackToHome, user }: CreatePrivateRoomProps) {
  const [chatMessages, setChatMessages] = useState([
    { type: 'system', content: 'Bienvenue dans la salle ! En attente des joueurs...', timestamp: '14:30' },
    { type: 'user', username: 'Vous', content: 'Salut tout le monde ! 👋', timestamp: '14:31' },
    { type: 'user', username: 'Alex', content: 'Prêt pour dessiner ! 🎨', timestamp: '14:32' },
    { type: 'user', username: 'Marie', content: 'Cette fois je vais gagner ! 😤', timestamp: '14:33' },
    { type: 'system', content: 'Vous êtes maintenant le propriétaire de la salle', timestamp: '14:33' }
  ]);
  
  const [chatInput, setChatInput] = useState('');
  const [customWords, setCustomWords] = useState('');
  const [customWordsOnly, setCustomWordsOnly] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [roomCode, setRoomCode] = useState('DRAW2024');
  const [isPrivate, setIsPrivate] = useState(true);
  
  // Liste des joueurs connectés
  const [connectedPlayers, setConnectedPlayers] = useState([
    { id: 1, name: user?.name || 'Vous', avatar: user?.avatar || '🎨', isOwner: true, isReady: false },
    { id: 2, name: 'Alex', avatar: '🚀', isOwner: false, isReady: true },
    { id: 3, name: 'Marie', avatar: '⭐', isOwner: false, isReady: false },
  ]);

  // Configuration de la salle
  const [roomConfig, setRoomConfig] = useState({
    players: '8',
    language: 'fr',
    drawTime: '80',
    rounds: '3',
    gameMode: 'normal',
    wordCount: '3',
    hints: '2',
    difficulty: 'normal',
    allowSpectators: true,
    autoStart: false
  });

  useEffect(() => {
    // Simulation de nouveaux joueurs qui rejoignent
    const interval = setInterval(() => {
      if (Math.random() > 0.7 && connectedPlayers.length < 6) {
        const names = ['Lucas', 'Sophie', 'Thomas', 'Emma', 'Nicolas', 'Clara'];
        const avatars = ['🎯', '🌟', '🎪', '🎭', '🎨', '🎮'];
        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
        
        if (!connectedPlayers.find(p => p.name === randomName)) {
          setConnectedPlayers(prev => [...prev, {
            id: Date.now(),
            name: randomName,
            avatar: randomAvatar,
            isOwner: false,
            isReady: Math.random() > 0.5
          }]);
          
          setChatMessages(prev => [...prev, {
            type: 'system',
            content: `${randomName} a rejoint la salle !`,
            timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
          }]);
        }
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [connectedPlayers]);

  const handleConfigChange = (field: string, value: any) => {
    setRoomConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('🎉 Salle créée avec succès ! Code: ' + roomCode);
    } catch (error) {
      console.error('Erreur lors de la création de la salle:', error);
      alert('❌ Erreur lors de la création de la salle');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChatSend = (e: any) => {
    if ((e.key === 'Enter' || e.type === 'click') && chatInput.trim()) {
      const newMessage = {
        type: 'user',
        username: 'Vous',
        content: chatInput.trim(),
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };
      
      setChatMessages(prev => [...prev, newMessage]);
      setChatInput('');

      // Simulation d'une réponse automatique
      setTimeout(() => {
        const responses = [
          "Super configuration ! 👍",
          "Ça va être génial ! 🎉",
          "J'ai hâte de commencer ! ✨",
          "Parfait ! 😊",
          "Prêt pour l'action ! 🚀"
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const botMessage = {
          type: 'user',
          username: connectedPlayers[Math.floor(Math.random() * (connectedPlayers.length - 1)) + 1]?.name || 'Bot',
          content: randomResponse,
          timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(prev => [...prev, botMessage]);
      }, 1000);
    }
  };

  const handleInvite = async () => {
    try {
      const inviteLink = `https://gamehub.com/room/${roomCode}`;
      await navigator.clipboard.writeText(inviteLink);
      alert('📋 Lien copié dans le presse-papiers !');
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
      alert(`🔗 Lien de la salle : https://gamehub.com/room/${roomCode}`);
    }
  };

  const handleStartGame = () => {
    const readyPlayers = connectedPlayers.filter(p => p.isReady || p.isOwner);
    if (readyPlayers.length < 2) {
      alert('⚠️ Il faut au moins 2 joueurs prêts pour commencer !');
      return;
    }
    alert('🎮 Lancement de la partie...');
  };

  const togglePlayerReady = (playerId: number) => {
    setConnectedPlayers(prev => prev.map(player => 
      player.id === playerId ? { ...player, isReady: !player.isReady } : player
    ));
  };

  const kickPlayer = (playerId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir expulser ce joueur ?')) {
      const player = connectedPlayers.find(p => p.id === playerId);
      setConnectedPlayers(prev => prev.filter(p => p.id !== playerId));
      setChatMessages(prev => [...prev, {
        type: 'system',
        content: `${player?.name} a été expulsé de la salle`,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    position: 'relative' as const,
    overflow: 'hidden' as const
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid rgba(139, 92, 246, 0.2)',
    borderRadius: '12px',
    fontSize: '14px',
    background: 'rgba(255, 255, 255, 0.9)',
    transition: 'all 0.3s ease',
    outline: 'none',

    
    boxSizing: 'border-box' as const
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fef3ff 0%, #fce7f3 25%, #f3e8ff 50%, #e0e7ff 75%, #fef3ff 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Éléments décoratifs */}
      <div style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none'
      }}>
        <div style={{
          position: 'absolute',
          top: '10%',
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
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px', position: 'relative', zIndex: 10 }}>
        {/* Header avec bouton retour */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <button
            onClick={onBackToHome}
            style={{
              background: 'rgba(139, 92, 246, 0.1)',
              color: '#8b5cf6',
              border: '2px solid rgba(139, 92, 246, 0.3)',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            ← Retour à l'accueil
          </button>

          {/* Info de la salle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '12px 24px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isPrivate ? <Lock size={16} color="#8b5cf6" /> : <Globe size={16} color="#10b981" />}
              <span style={{ fontWeight: '600', color: '#374151' }}>Code: {roomCode}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={16} color="#6b7280" />
              <span style={{ color: '#6b7280' }}>{connectedPlayers.length}/8</span>
            </div>
          </div>
        </div>

        {/* Titre principal */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #1f2937 0%, #8b5cf6 50%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px'
          }}>
            🎨 Créer une salle privée
          </h1>
          <p style={{
            fontSize: '18px',
            color: 'rgba(55, 65, 81, 0.7)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Configurez votre partie personnalisée et invitez vos amis à dessiner ensemble
          </p>
        </div>

        {/* Layout principal */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '32px'
        }}>
          {/* Configuration de la salle */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Formulaire de base */}
            <div style={{ ...cardStyle, padding: '32px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '24px'
              }}>
                <Settings size={24} color="#8b5cf6" />
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#374151',
                  margin: 0
                }}>
                  Configuration
                </h2>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  marginBottom: '24px'
                }}>
                  {/* Nom de la salle */}
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151'
                    }}>
                      🏷️ Nom de la salle
                    </label>
                    <input
                      type="text"
                      placeholder="Ma super salle"
                      style={inputStyle}
                    />
                  </div>

                  {/* Nombre de joueurs */}
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151'
                    }}>
                      👥 Joueurs max
                    </label>
                    <select 
                      style={inputStyle}
                      value={roomConfig.players}
                      onChange={(e) => handleConfigChange('players', e.target.value)}
                    >
                      <option value="2">2 joueurs</option>
                      <option value="4">4 joueurs</option>
                      <option value="6">6 joueurs</option>
                      <option value="8">8 joueurs</option>
                    </select>
                  </div>

                  {/* Temps de dessin */}
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151'
                    }}>
                      ⏱️ Temps (sec)
                    </label>
                    <select 
                      style={inputStyle}
                      value={roomConfig.drawTime}
                      onChange={(e) => handleConfigChange('drawTime', e.target.value)}
                    >
                      <option value="30">30</option>
                      <option value="60">60</option>
                      <option value="80">80</option>
                      <option value="120">120</option>
                    </select>
                  </div>

                  {/* Nombre de manches */}
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151'
                    }}>
                      🔄 Manches
                    </label>
                    <select 
                      style={inputStyle}
                      value={roomConfig.rounds}
                      onChange={(e) => handleConfigChange('rounds', e.target.value)}
                    >
                      <option value="1">1 manche</option>
                      <option value="3">3 manches</option>
                      <option value="5">5 manches</option>
                    </select>
                  </div>
                </div>

                {/* Options avancées */}
                <div style={{ marginBottom: '24px' }}>
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'none',
                      border: 'none',
                      color: '#8b5cf6',
                      fontWeight: '600',
                      cursor: 'pointer',
                      padding: '8px 0'
                    }}
                  >
                    {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    Options avancées
                  </button>

                  {showAdvanced && (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '16px',
                      marginTop: '16px',
                      padding: '16px',
                      background: 'rgba(139, 92, 246, 0.05)',
                      borderRadius: '12px',
                      border: '1px solid rgba(139, 92, 246, 0.1)'
                    }}>
                      <div>
                        <label style={{
                          display: 'block',
                          marginBottom: '6px',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151'
                        }}>
                          🌍 Langue
                        </label>
                        <select style={inputStyle}>
                          <option value="fr">Français</option>
                          <option value="en">English</option>
                          <option value="es">Español</option>
                        </select>
                      </div>

                      <div>
                        <label style={{
                          display: 'block',
                          marginBottom: '6px',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151'
                        }}>
                          🎯 Difficulté
                        </label>
                        <select style={inputStyle}>
                          <option value="easy">Facile</option>
                          <option value="normal">Normal</option>
                          <option value="hard">Difficile</option>
                        </select>
                      </div>

                      <div>
                        <label style={{
                          display: 'block',
                          marginBottom: '6px',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151'
                        }}>
                          💡 Indices
                        </label>
                        <select style={inputStyle}>
                          <option value="0">Aucun</option>
                          <option value="1">1 indice</option>
                          <option value="2">2 indices</option>
                        </select>
                      </div>

                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151'
                        }}>
                          <input
                            type="checkbox"
                            checked={roomConfig.allowSpectators}
                            onChange={(e) => handleConfigChange('allowSpectators', e.target.checked)}
                            style={{ transform: 'scale(1.2)' }}
                          />
                          👁️ Autoriser les spectateurs
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Boutons d'action */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      flex: 1,
                      background: isSubmitting 
                        ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                        : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '16px 24px',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <div style={{
                          width: '16px',
                          height: '16px',
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                          borderTop: '2px solid white',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }}></div>
                        Création...
                      </>
                    ) : (
                      <>🚀 Créer la salle</>
                    )}
                  </button>

                  <button 
                    type="button"
                    onClick={handleInvite}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '16px 24px',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <Copy size={16} />
                    Inviter
                  </button>
                </div>
              </form>
            </div>

            {/* Mots personnalisés */}
            <div style={{ ...cardStyle, padding: '24px' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                📚 Mots personnalisés
              </h3>
              <textarea 
                placeholder="Entrez vos mots séparés par des virgules..."
                value={customWords}
                onChange={(e) => setCustomWords(e.target.value)}
                style={{
                  ...inputStyle,
                  minHeight: '80px',
                  resize: 'vertical' as const,
                  marginBottom: '12px'
                }}
              />
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: '#6b7280',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={customWordsOnly}
                  onChange={(e) => setCustomWordsOnly(e.target.checked)}
                  style={{ transform: 'scale(1.1)' }}
                />
                Utiliser uniquement les mots personnalisés
              </label>
            </div>
          </div>

          {/* Panel des joueurs et chat */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Liste des joueurs */}
            <div style={{ ...cardStyle, padding: '24px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#374151',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Users size={20} />
                  Joueurs ({connectedPlayers.length}/8)
                </h3>
                <button
                  onClick={handleStartGame}
                  style={{
                    background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Play size={14} />
                  Lancer
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {connectedPlayers.map((player) => (
                  <div key={player.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    background: player.isReady ? 'rgba(16, 185, 129, 0.1)' : 'rgba(156, 163, 175, 0.1)',
                    borderRadius: '12px',
                    border: `2px solid ${player.isReady ? 'rgba(16, 185, 129, 0.2)' : 'rgba(156, 163, 175, 0.2)'}`,
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '20px' }}>{player.avatar}</span>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            fontWeight: '600',
                            color: '#374151'
                          }}>
                            {player.name}
                          </span>
                          {player.isOwner && (
                            <Crown size={14} color="#f59e0b" />
                          )}
                        </div>
                        <span style={{
                          fontSize: '12px',
                          color: player.isReady ? '#10b981' : '#6b7280',
                          fontWeight: '500'
                        }}>
                          {player.isReady ? '✅ Prêt' : '⏳ En attente'}
                        </span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {player.id === 1 ? (
                        <button
                          onClick={() => togglePlayerReady(player.id)}
                          style={{
                            background: player.isReady ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                            color: player.isReady ? '#dc2626' : '#059669',
                            border: `1px solid ${player.isReady ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}
                        >
                          {player.isReady ? 'Pas prêt' : 'Prêt'}
                        </button>
                      ) : (
                        <button
                          onClick={() => kickPlayer(player.id)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#dc2626',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            padding: '6px 8px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Expulser
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bouton d'invitation rapide */}
              <div style={{
                marginTop: '16px',
                padding: '12px',
                background: 'rgba(59, 130, 246, 0.05)',
                borderRadius: '12px',
                border: '1px dashed rgba(59, 130, 246, 0.3)',
                textAlign: 'center'
              }}>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '0 0 8px 0'
                }}>
                  Invitez vos amis avec le code de salle
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="text"
                    value={roomCode}
                    readOnly
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      background: 'white',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      textAlign: 'center',
                      color: '#3b82f6'
                    }}
                  />
                  <button
                    onClick={handleInvite}
                    style={{
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      padding: '8px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Chat de la salle */}
            <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', height: '350px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '20px 20px 16px 20px',
                borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
              }}>
                <MessageCircle size={20} color="#8b5cf6" />
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#374151',
                  margin: 0
                }}>
                  Chat de la salle
                </h3>
              </div>

              {/* Messages */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {chatMessages.map((message, index) => (
                  <div 
                    key={index}
                    style={{
                      padding: message.type === 'system' ? '8px 12px' : '10px 12px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      lineHeight: '1.4',
                      background: message.type === 'system' 
                        ? 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)' 
                        : 'rgba(243, 244, 246, 0.8)',
                      color: message.type === 'system' ? 'white' : '#374151',
                      textAlign: message.type === 'system' ? 'center' : 'left',
                      fontStyle: message.type === 'system' ? 'italic' : 'normal',
                      position: 'relative'
                    }}
                  >
                    {message.type === 'user' && (
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '4px'
                      }}>
                        <span style={{
                          fontWeight: '600',
                          color: '#8b5cf6',
                          fontSize: '13px'
                        }}>
                          {message.username}
                        </span>
                        <span style={{
                          fontSize: '11px',
                          color: '#9ca3af'
                        }}>
                          {message.timestamp}
                        </span>
                      </div>
                    )}
                    <div>{message.content}</div>
                    {message.type === 'system' && (
                      <span style={{
                        position: 'absolute',
                        top: '8px',
                        right: '12px',
                        fontSize: '11px',
                        opacity: 0.8
                      }}>
                        {message.timestamp}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Input de chat */}
              <div style={{
                padding: '16px 20px',
                borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                background: 'rgba(248, 250, 252, 0.5)'
              }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    placeholder="Tapez votre message..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={handleChatSend}
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      border: '2px solid rgba(139, 92, 246, 0.2)',
                      borderRadius: '10px',
                      fontSize: '14px',
                      background: 'white',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    maxLength={200}
                  />
                  <button
                    onClick={handleChatSend}
                    style={{
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '10px 16px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px',
                      transition: 'all 0.3s ease',
                      minWidth: '70px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    💬
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}