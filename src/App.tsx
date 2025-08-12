import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import './App.css';

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
      console.log(isGameOver);
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

  console.log(solution);

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

function Line({
  guess,
  isFinal,
  solution,
}: {
  guess: string;
  isFinal: boolean;
  solution: string;
}) {
  return (
    <div className="line">
      {Array.from({ length: 5 }).map((_, i) => {
        const char = guess[i];
        let className = 'tile';

        if (isFinal) {
          if (char === solution[i]) {
            className += ' correct';
          } else if (solution.includes(char)) {
            className += ' close';
          } else {
            className += ' incorrect';
          }
        }
        return (
          <div className={className} key={i}>
            {char}
          </div>
        );
      })}
    </div>
  );
}
