'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Palette, Eraser, RotateCcw, Send, Crown, Users, Clock, Star, Home } from 'lucide-react';

interface DrawMasterGameProps {
  onBackToHome: () => void;
  user: any;
}

export default function DrawMasterGame({ onBackToHome, user }: DrawMasterGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [currentTool, setCurrentTool] = useState('brush');
  const [chatMessage, setChatMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(75);
  const [currentWord, setCurrentWord] = useState('_ _ _ _ _ _');
  const [isCurrentDrawer, setIsCurrentDrawer] = useState(true);
  const [guessInput, setGuessInput] = useState('');

  const [players] = useState([
    { id: 1, name: user?.name || 'Vous', score: 1250, isDrawing: true, avatar: user?.avatar || '🎨', rank: 1 },
    { id: 2, name: 'ArtMaster', score: 980, isDrawing: false, avatar: '👑', rank: 2 },
    { id: 3, name: 'SketchKing', score: 750, isDrawing: false, avatar: '⭐', rank: 3 },
    { id: 4, name: 'DoodleQueen', score: 620, isDrawing: false, avatar: '💎', rank: 4 },
    { id: 5, name: 'PaintPro', score: 480, isDrawing: false, avatar: '🏆', rank: 5 },
    { id: 6, name: 'ColorWiz', score: 320, isDrawing: false, avatar: '🎯', rank: 6 }
  ]);

  const [chatMessages] = useState([
    { id: 1, player: 'ArtMaster', message: 'Salut tout le monde! 👋', type: 'chat' },
    { id: 2, player: 'SketchKing', message: 'Est-ce que c\'est un animal?', type: 'guess' },
    { id: 3, player: 'DoodleQueen', message: 'Chat?', type: 'guess' },
    { id: 4, player: 'PaintPro', message: 'Non, c\'est plus gros!', type: 'chat' },
    { id: 5, player: 'ColorWiz', message: 'Éléphant!', type: 'guess' }
  ]);

  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB', '#A52A2A',
    '#808080', '#90EE90', '#FFB6C1', '#20B2AA', '#DDA0DD', '#F0E68C'
  ];

  const brushSizes = [2, 5, 10, 15, 20];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) return 75;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent) => {
    if (!isCurrentDrawer) return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.strokeStyle = currentTool === 'eraser' ? '#FFFFFF' : brushColor;
    ctx.lineWidth = currentTool === 'eraser' ? brushSize * 2 : brushSize;
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !isCurrentDrawer) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!isCurrentDrawer) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const sendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (chatMessage.trim()) {
      setChatMessage('');
    }
  };

  const sendGuess = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (guessInput.trim()) {
      setGuessInput('');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      background: 'linear-gradient(135deg, #fef3ff 0%, #fce7f3 25%, #f3e8ff 50%, #e0e7ff 75%, #fef3ff 100%)',
      padding: '16px',
      overflow: 'hidden'
    }}>
      {/* Formes géométriques abstraites en arrière-plan */}
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
          width: '128px',
          height: '128px',
          background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)',
          borderRadius: '50%',
          filter: 'blur(40px)'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '25%',
          right: '20%',
          width: '96px',
          height: '96px',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.4) 0%, rgba(6, 182, 212, 0.4) 100%)',
          borderRadius: '50%',
          filter: 'blur(32px)'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '33%',
          left: '25%',
          width: '160px',
          height: '160px',
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.25) 0%, rgba(245, 101, 101, 0.25) 100%)',
          borderRadius: '50%',
          filter: 'blur(64px)'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '20%',
          right: '25%',
          width: '112px',
          height: '112px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.35) 0%, rgba(5, 150, 105, 0.35) 100%)',
          borderRadius: '50%',
          filter: 'blur(40px)'
        }}></div>
      </div>
      
      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(32px)',
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '24px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button 
                onClick={onBackToHome}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  padding: '8px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
              >
                <Home style={{ color: '#374151', width: '24px', height: '24px' }} />
              </button>
              <div style={{
                background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                padding: '12px',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
              }}>
                <Palette style={{ color: 'white', width: '32px', height: '32px' }} />
              </div>
              
              <div>
                <h1 style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#374151',
                  margin: 0
                }}>
                  DrawMaster
                </h1>
                <p style={{ color: '#6b7280', margin: 0 }}>Manche 2 de 3</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(8px)',
                borderRadius: '12px',
                padding: '8px 16px',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock style={{ color: '#374151', width: '20px', height: '20px' }} />
                  <span style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: timeLeft <= 10 ? '#ef4444' : '#374151'
                  }}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(8px)',
                borderRadius: '12px',
                padding: '8px 16px',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users style={{ color: '#374151', width: '20px', height: '20px' }} />
                  <span style={{ color: '#374151', fontWeight: '600' }}>{players.length}/8</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr 1fr',
          gap: '24px'
        }}>
          {/* Panneau des joueurs */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(32px)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#374151',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Crown style={{ marginRight: '8px', color: '#f59e0b' }} />
              Joueurs
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {players.map((player) => (
                <div key={player.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  background: player.isDrawing 
                    ? 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)' 
                    : 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  transform: player.isDrawing ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: player.isDrawing ? '0 8px 25px rgba(16, 185, 129, 0.3)' : '0 4px 15px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '24px' }}>{player.avatar}</span>
                    <div>
                      <p style={{
                        fontWeight: '600',
                        color: player.isDrawing ? 'white' : '#374151',
                        margin: 0
                      }}>
                        {player.name}
                        {player.isDrawing && (
                          <span style={{
                            marginLeft: '8px',
                            fontSize: '12px',
                            background: 'rgba(255, 255, 255, 0.3)',
                            padding: '2px 8px',
                            borderRadius: '20px'
                          }}>
                            DESSINE
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{
                      fontWeight: 'bold',
                      color: player.isDrawing ? 'white' : '#374151',
                      margin: 0
                    }}>
                      {player.score}
                    </p>
                    <p style={{
                      fontSize: '12px',
                      color: player.isDrawing ? 'rgba(255, 255, 255, 0.7)' : '#6b7280',
                      margin: 0
                    }}>
                      #{player.rank}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Zone de jeu principale */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Mot à deviner */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(32px)',
              borderRadius: '16px',
              padding: '16px',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#6b7280', marginBottom: '8px', margin: 0 }}>Mot à deviner:</p>
                <p style={{
                  fontSize: '32px',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  color: '#374151',
                  letterSpacing: '4px',
                  margin: 0
                }}>
                  {currentWord}
                </p>
                <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px', margin: 0 }}>
                  
                </p>
              </div>
            </div>

            {/* Outils de dessin */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(32px)',
              borderRadius: '16px',
              padding: '16px',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {/* Sélecteur d'outils */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setCurrentTool('brush')}
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        transition: 'all 0.3s ease',
                        background: currentTool === 'brush' 
                          ? 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)' 
                          : 'rgba(255, 255, 255, 0.2)',
                        color: currentTool === 'brush' ? 'white' : '#6b7280',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        cursor: 'pointer',
                        transform: currentTool === 'brush' ? 'scale(1.1)' : 'scale(1)',
                        boxShadow: currentTool === 'brush' ? '0 8px 25px rgba(139, 92, 246, 0.3)' : 'none'
                      }}
                    >
                      <Palette style={{ width: '20px', height: '20px' }} />
                    </button>
                    <button
                      onClick={() => setCurrentTool('eraser')}
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        transition: 'all 0.3s ease',
                        background: currentTool === 'eraser' 
                          ? 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)' 
                          : 'rgba(255, 255, 255, 0.2)',
                        color: currentTool === 'eraser' ? 'white' : '#6b7280',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        cursor: 'pointer',
                        transform: currentTool === 'eraser' ? 'scale(1.1)' : 'scale(1)',
                        boxShadow: currentTool === 'eraser' ? '0 8px 25px rgba(139, 92, 246, 0.3)' : 'none'
                      }}
                    >
                      <Eraser style={{ width: '20px', height: '20px' }} />
                    </button>
                    <button
                      onClick={clearCanvas}
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: '#6b7280',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                    >
                      <RotateCcw style={{ width: '20px', height: '20px' }} />
                    </button>
                  </div>

                  {/* Tailles de pinceau */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {brushSizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setBrushSize(size)}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.3s ease',
                          background: brushSize === size 
                            ? 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)' 
                            : 'rgba(255, 255, 255, 0.2)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          cursor: 'pointer',
                          transform: brushSize === size ? 'scale(1.1)' : 'scale(1)',
                          boxShadow: brushSize === size ? '0 8px 25px rgba(139, 92, 246, 0.3)' : 'none'
                        }}
                      >
                        <div 
                          style={{
                            borderRadius: '50%',
                            background: '#6b7280',
                            width: Math.max(2, size/2) + 'px',
                            height: Math.max(2, size/2) + 'px'
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Palette de couleurs */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setBrushColor(color)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        border: brushColor === color ? '2px solid #374151' : '2px solid rgba(255, 255, 255, 0.3)',
                        backgroundColor: color,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        transform: brushColor === color ? 'scale(1.1)' : 'scale(1)',
                        boxShadow: brushColor === color ? '0 4px 15px rgba(0, 0, 0, 0.2)' : 'none'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = brushColor === color ? 'scale(1.1)' : 'scale(1)'}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Canvas de dessin */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '16px',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)'
            }}>
              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                style={{
                  width: '100%',
                  height: 'auto',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  cursor: 'crosshair',
                  backgroundColor: '#FFFFFF'
                }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </div>

            {/* Zone de devine */}
            {!isCurrentDrawer && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(32px)',
                borderRadius: '16px',
                padding: '16px',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input
                    type="text"
                    value={guessInput}
                    onChange={(e) => setGuessInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendGuess(e)}
                    placeholder="Tapez votre réponse ici..."
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: '#374151',
                      fontSize: '16px',
                      outline: 'none',
                      backdropFilter: 'blur(8px)'
                    }}
                  />
                  <button
                    onClick={sendGuess}
                    style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
                      color: 'white',
                      borderRadius: '12px',
                      border: 'none',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
                    }}
                  >
                    Deviner
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Chat */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(32px)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#374151',
              marginBottom: '16px'
            }}>
              Chat
            </h2>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '12px',
              marginBottom: '16px',
              height: '256px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {chatMessages.map((msg) => (
                <div key={msg.id} style={{
                  padding: '8px',
                  borderRadius: '8px',
                  background: msg.type === 'guess' 
                    ? 'rgba(251, 191, 36, 0.2)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  borderLeft: msg.type === 'guess' ? '4px solid #f59e0b' : 'none'
                }}>
                  <p style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    margin: 0,
                    marginBottom: '2px'
                  }}>
                    {msg.player}
                  </p>
                  <p style={{
                    color: '#374151',
                    fontSize: '14px',
                    margin: 0
                  }}>
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage(e)}
                placeholder="Tapez votre message..."
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#374151',
                  fontSize: '14px',
                  outline: 'none',
                  backdropFilter: 'blur(8px)'
                }}
              />
              <button
                onClick={sendMessage}
                style={{
                  padding: '8px',
                  background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                  color: 'white',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.4)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.3)'}
              >
                <Send style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}