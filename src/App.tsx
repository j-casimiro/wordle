import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import './App.css';
import Line from './Line';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
});

export default function App() {
  const [solution, setSolution] = useState('');
  const [guesses, setGuesses] = useState<string[]>(Array(6).fill(null));
  const [currentGuess, setCurrentGuess] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    const fetchSolution = async () => {
      const response = await fetch(
        'https://random-word-api.herokuapp.com/word?length=5'
      );
      const data: string = await response.json();
      setSolution(data[0].toUpperCase());
    };
    fetchSolution();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver) {
        return;
      }

      if (e.key === 'Enter') {
        if (currentGuess.length !== 5) {
          return;
        }

        const newGuesses = [...guesses];
        newGuesses[guesses.findIndex((val) => val == null)] = currentGuess;
        setGuesses(newGuesses);
        setCurrentGuess('');

        if (currentGuess === solution) {
          setIsGameOver(true);
          return;
        }
      }

      if (e.key === 'Backspace') {
        setCurrentGuess(currentGuess.slice(0, -1));
      }

      if (currentGuess.length >= 5) {
        return;
      }

      if (/^[a-zA-Z]$/.test(e.key)) {
        setCurrentGuess((prevGuess) => prevGuess + e.key.toUpperCase());
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentGuess, guesses, isGameOver, solution]);

  return (
    <Container>
      {guesses.map((guess, i) => {
        const isCurrentGuess = i === guesses.findIndex((val) => val == null);
        return (
          <Line
            key={i}
            guess={isCurrentGuess ? currentGuess : guess ?? ''}
            isFinal={!isCurrentGuess && guess !== null}
            solution={solution}
          ></Line>
        );
      })}
    </Container>
  );
}
