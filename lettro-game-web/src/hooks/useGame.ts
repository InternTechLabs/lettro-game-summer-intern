import { useState, useCallback } from 'react'

export interface GameState {
  playerName: string
  selectedLanguage: string
  currentMode: string | null
  isGameStarted: boolean
}

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    playerName: '',
    selectedLanguage: '',
    currentMode: null,
    isGameStarted: false
  })

  const updatePlayerName = useCallback((name: string) => {
    setGameState(prev => ({ ...prev, playerName: name }))
  }, [])

  const updateLanguage = useCallback((language: string) => {
    setGameState(prev => ({ ...prev, selectedLanguage: language }))
  }, [])

  const startGame = useCallback((mode: string) => {
    setGameState(prev => ({ 
      ...prev, 
      currentMode: mode, 
      isGameStarted: true 
    }))
  }, [])

  const resetGame = useCallback(() => {
    setGameState({
      playerName: '',
      selectedLanguage: '',
      currentMode: null,
      isGameStarted: false
    })
  }, [])

  return {
    gameState,
    updatePlayerName,
    updateLanguage,
    startGame,
    resetGame
  }
}
