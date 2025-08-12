export default function Line({
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
