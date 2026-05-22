"use client";

"use client";


import { useEffect, useState } from "react";
import SECRET_WORDS from "./secretWords";
import VALID_WORDS from "./validWords";
import Confetti from "react-confetti";

export default function Home() {
  const ROWS = 6;
  const COLS = 5;

  const emptyBoard = Array.from({ length: ROWS }, () =>
    Array(COLS).fill("")
  );

  const emptyColors = Array.from({ length: ROWS }, () =>
    Array(COLS).fill("")
  );

  const [board, setBoard] = useState(emptyBoard);
  const [colors, setColors] = useState(emptyColors);

  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);

  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [guessedWords, setGuessedWords] = useState<string[]>([]);
  const [toast, setToast] = useState("");
  const [keyColors, setKeyColors] = useState<{ [key: string]: string }>({});
  const [secretWord, setSecretWord] = useState("");
  const [shakeRow, setShakeRow] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);


  useEffect(() => {
    const randomWord =
      SECRET_WORDS[
      Math.floor(Math.random() * SECRET_WORDS.length)
      ]

    setSecretWord(randomWord);
  }, []);


  const handleKeyPress = (key: string) => {
    if (gameOver) return;

    if (currentCol < COLS) {
      const newBoard = [...board];
      newBoard[currentRow][currentCol] = key;
      setBoard(newBoard);
      setCurrentCol(currentCol + 1);
    }
  };

  const handleDelete = () => {
    if (gameOver) return;

    if (currentCol > 0) {
      const newBoard = [...board];
      newBoard[currentRow][currentCol - 1] = "";
      setBoard(newBoard);
      setCurrentCol(currentCol - 1);
    }
  };

  const handleEnter = () => {
    setTimeout(() => {
      window.focus();
    }, 0);
    if (gameOver) return;

    if (currentCol !== COLS) return;

    const guess = board[currentRow].join("");
    if (!VALID_WORDS.includes(guess)) {
      setToast("❌ Not a valid word");

      setShakeRow(null);

      setTimeout(() => {
        setShakeRow(null);

        setTimeout(() => {
          setShakeRow(currentRow);
        }, 10);
      }, 10);

      setTimeout(() => {
        setToast("");
        setShakeRow(null);
      }, 500);

      return;
    }
    if (guessedWords.includes(guess)) {
      setToast("⚠️ Word already guessed");

      setShakeRow(currentRow);

      setTimeout(() => {
        setToast("");
        setShakeRow(null);
      }, 500);

      return;
    }

    const newColors = [...colors];

    const updatedKeyColors = { ...keyColors };

    for (let i = 0; i < COLS; i++) {
      const letter = guess[i];

      if (guess[i] === secretWord[i]) {
        newColors[currentRow][i] = "green";

        updatedKeyColors[letter] = "bg-green-600";
      } else if (secretWord.includes(guess[i])) {
        newColors[currentRow][i] = "yellow";

        if (updatedKeyColors[letter] !== "bg-green-600") {
          updatedKeyColors[letter] = "bg-yellow-500";
        }
      } else {
        newColors[currentRow][i] = "gray";

        if (
          updatedKeyColors[letter] !== "bg-green-600" &&
          updatedKeyColors[letter] !== "bg-yellow-500"
        ) {
          updatedKeyColors[letter] = "bg-gray-500 dark:bg-gray-700";
        }
      }
    }

    setColors(newColors);
    setKeyColors(updatedKeyColors);
    setGuessedWords([...guessedWords, guess]);

    if (guess === secretWord) {
      const newWins = wins + 1;
      const newGames = gamesPlayed + 1;

      setWins(newWins);
      setGamesPlayed(newGames);

      const newStreak = streak + 1;

      setStreak(newStreak);

      localStorage.setItem(
        "streak",
        String(newStreak)
      );

      if (newStreak > bestStreak) {
        setBestStreak(newStreak);

        localStorage.setItem(
          "bestStreak",
          String(newStreak)
        );
      }

      localStorage.setItem("wins", String(newWins));
      localStorage.setItem("gamesPlayed", String(newGames));

      setMessage("🎉 You Won!");
      setShowConfetti(true);

      setTimeout(() => {
        setShowConfetti(false);
      }, 7000);
      setGameOver(true);
      return;
    }

    if (currentRow === ROWS - 1) {
      const newLosses = losses + 1;
      const newGames = gamesPlayed + 1;

      setLosses(newLosses);
      setGamesPlayed(newGames);

      setStreak(0);
      localStorage.setItem("streak", "0");

      localStorage.setItem("losses", String(newLosses));
      localStorage.setItem("gamesPlayed", String(newGames));

      setMessage(`😢 Word was ${secretWord}`);
      setGameOver(true);
      return;
    }

    setCurrentRow(currentRow + 1);
    setCurrentCol(0);
  };

  useEffect(() => {
    const savedWins = localStorage.getItem("wins");
    const savedLosses = localStorage.getItem("losses");
    const savedGames = localStorage.getItem("gamesPlayed");

    const savedStreak = localStorage.getItem("streak");

    const savedBestStreak =
      localStorage.getItem("bestStreak");

    if (savedWins) setWins(Number(savedWins));

    if (savedLosses) setLosses(Number(savedLosses));

    if (savedGames) setGamesPlayed(Number(savedGames));

    if (savedStreak) setStreak(Number(savedStreak));

    if (savedBestStreak) {
      setBestStreak(Number(savedBestStreak));
    }
    const listener = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();

      if (/^[A-Z]$/.test(key)) {
        handleKeyPress(key);
      } else if (e.key === "Backspace") {
        handleDelete();
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleEnter();
      }
    };

    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [board, currentCol, currentRow, gameOver]);


  const getTileColor = (color: string) => {
    if (color === "green") return "bg-green-600 border-green-600";
    if (color === "yellow") return "bg-yellow-500 border-yellow-500";
    if (color === "gray")
      return darkMode
        ? "bg-gray-700 border-gray-700 text-white"
        : "bg-gray-300 border-gray-300 text-black";

    return darkMode
      ? "border-gray-600"
      : "border-gray-400";
  };
  const shareScore = async () => {
    let result = `WordleMania ${currentRow + 1}/6\n\n`;

    for (let i = 0; i <= currentRow; i++) {
      let row = "";

      for (let j = 0; j < COLS; j++) {
        const color = colors[i][j];

        if (color === "green") {
          row += "🟩";
        } else if (color === "yellow") {
          row += "🟨";
        } else {
          row += "⬛";
        }
      }

      result += row + "\n";
    }

    try {
      await navigator.clipboard.writeText(result);

      setToast("📋 Score copied to clipboard!");

      setTimeout(() => {
        setToast("");
      }, 2000);
    } catch {
      setToast("❌ Failed to copy");

      setTimeout(() => {
        setToast("");
      }, 2000);
    }
  };
  const playAgain = () => {
    const randomWord =
      SECRET_WORDS[
      Math.floor(Math.random() * SECRET_WORDS.length)
      ]

    setSecretWord(randomWord);
    setShowConfetti(false);

    setBoard(
      Array.from({ length: ROWS }, () =>
        Array(COLS).fill("")
      )
    );

    setColors(
      Array.from({ length: ROWS }, () =>
        Array(COLS).fill("")
      )
    );

    setCurrentRow(0);
    setCurrentCol(0);
    setGameOver(false);
    setMessage("");
    setGuessedWords([]);
    setKeyColors({});
  };

  return (

    <main
      className={`min-h-screen w-full overflow-x-hidden flex flex-col items-center transition-colors duration-300 ${darkMode
        ? "bg-[#121213] text-white"
        : "bg-white text-black"
        }`}
    >
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 px-6 py-4 rounded-xl shadow-2xl z-50 font-semibold transition-all ${darkMode
            ? "bg-white text-black"
            : "bg-black text-white"
            }`}
        >
          {toast}
        </div>
      )}
      {showConfetti && <Confetti />}

      {/* Header */}
      <div
        className={`w-full border-b py-4 text-center ${darkMode ? "border-gray-700" : "border-gray-300"
          }`}
      >
        <h1
          className={`text-3xl sm:text-4xl font-bold tracking-widest ${darkMode ? "text-white" : "text-black"
            }`}
        >
          Wordle Unlimited
        </h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`absolute top-3 right-3 sm:top-4 sm:right-4
          w-11 h-11 sm:w-12 sm:h-12
          rounded-xl
          flex items-center justify-center
          text-lg
          shadow-lg
          transition-all duration-300
          ${darkMode
              ? "bg-gray-700 text-yellow-300"
              : "bg-gray-200 text-black"
            }`}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>

      {/* Game Over Popup */}
      {gameOver && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div
            className={`rounded-2xl p-5 sm:p-8 w-[90%] max-w-md text-center shadow-2xl border transition-all ${darkMode
              ? "bg-[#121213] border-gray-700 text-white"
              : "bg-white border-gray-300 text-black"
              }`}
          >

            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              {message}
            </h2>

            <p className="text-gray-400 mb-6">
              Thanks for playing
            </p>

            <div className="grid grid-cols-2 gap-4">

              <div
                className={`rounded-xl p-4 ${darkMode
                  ? "bg-[#1f1f1f]"
                  : "bg-gray-200"
                  }`}
              >
                <p className="text-2xl sm:text-3xl font-bold">
                  {streak}
                </p>
                <p className="text-sm text-gray-400">
                  Streak
                </p>
              </div>

              <div
                className={`rounded-xl p-4 ${darkMode
                  ? "bg-[#1f1f1f]"
                  : "bg-gray-200"
                  }`}
              >
                <p className="text-2xl sm:text-3xl font-bold">
                  {bestStreak}
                </p>
                <p className="text-sm text-gray-400">
                  Best
                </p>
              </div>

              <div
                className={`rounded-xl p-4 ${darkMode
                  ? "bg-[#1f1f1f]"
                  : "bg-gray-200"
                  }`}
              >
                <p className="text-2xl sm:text-3xl font-bold">
                  {gamesPlayed}
                </p>
                <p className="text-sm text-gray-400">
                  Played
                </p>
              </div>

              <div
                className={`rounded-xl p-4 ${darkMode
                  ? "bg-[#1f1f1f]"
                  : "bg-gray-200"
                  }`}
              >
                <p className="text-2xl sm:text-3xl font-bold">
                  {wins}
                </p>
                <p className="text-sm text-gray-400">
                  Wins
                </p>
              </div>

              <div
                className={`rounded-xl p-4 ${darkMode
                  ? "bg-[#1f1f1f]"
                  : "bg-gray-200"
                  }`}
              >
                <p className="text-2xl sm:text-3xl font-bold">
                  {losses}
                </p>
                <p className="text-sm text-gray-400">
                  Losses
                </p>
              </div>

              <div
                className={`rounded-xl p-4 ${darkMode
                  ? "bg-[#1f1f1f]"
                  : "bg-gray-200"
                  }`}
              >
                <p className="text-2xl sm:text-3xl font-bold">
                  {gamesPlayed
                    ? Math.round((wins / gamesPlayed) * 100)
                    : 0}
                  %
                </p>

                <p className="text-sm text-gray-400">
                  Win %
                </p>
              </div>

            </div>

            <div className="mt-8 flex gap-3">

              <button
                onClick={shareScore}
                className="bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-xl text-sm font-bold transition cursor-pointer"
              >
                Share
              </button>

              <button
                onClick={playAgain}
                className="flex-1 bg-green-600 hover:bg-green-500 py-4 rounded-xl text-lg font-bold transition cursor-pointer"
              >
                Play Again
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem("wins");
                  localStorage.removeItem("losses");
                  localStorage.removeItem("gamesPlayed");
                  localStorage.removeItem("streak");
                  localStorage.removeItem("bestStreak");

                  setStreak(0);
                  setBestStreak(0);
                  setWins(0);
                  setLosses(0);
                  setGamesPlayed(0);
                }}
                className="bg-red-600 hover:bg-red-500 px-4 rounded-xl font-bold transition cursor-pointer"
              >
                Reset
              </button>

            </div>

          </div>
        </div>
      )}

      {/* Board */}
      <div className="grid grid-rows-6 gap-2 mt-10">
        {board.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`grid grid-cols-5 gap-2 ${shakeRow === rowIndex ? "shake" : ""
              }`}
          >
            {row.map((cell, cellIndex) => (
              <div
                key={cellIndex}
                className={`w-12 h-12 sm:w-16 sm:h-16 border-2 flex items-center justify-center text-xl sm:text-2xl font-bold uppercase transition-all duration-500 transform hover:scale-105 ${colors[rowIndex][cellIndex] ? "flip" : ""
                  } ${getTileColor(
                    colors[rowIndex][cellIndex]
                  )}`}
              >
                <span
                  className={`transition-all duration-300 ${cell ? "animate-pulse" : ""
                    }`}
                >
                  {cell}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Keyboard */}
      <div className="mt-6 sm:mt-10 space-y-1 sm:space-y-2 px-1 w-full max-w-xl">
        {[
          "QWERTYUIOP",
          "ASDFGHJKL",
          "ZXCVBNM"
        ].map((row, index) => (
          <div key={index} className="flex justify-center gap-1 sm:gap-2 flex-nowrap">
            {row.split("").map((key) => (
              <button
                key={key}
                onClick={() => handleKeyPress(key)}
                className={`${keyColors[key] ||
                  (darkMode
                    ? "bg-gray-700 text-white"
                    : "bg-gray-300 text-black")
                  } hover:opacity-80 w-8 sm:w-12 h-11 sm:h-14 rounded font-bold text-xs sm:text-base cursor-pointer transition-all flex items-center justify-center`}
              >
                {key}
              </button>
            ))}

            {index === 2 && (
              <>
                <button
                  onClick={handleDelete}
                  className="bg-red-700 hover:bg-red-600 w-14 sm:w-20 h-10 sm:h-14 rounded font-bold text-xs sm:text-base cursor-pointer transition-all flex items-center justify-center"
                >
                  DEL
                </button>

                <button
                  onClick={handleEnter}
                  className="bg-green-700 hover:bg-green-600 w-16 sm:w-24 h-10 sm:h-14 rounded font-bold text-xs sm:text-base cursor-pointer transition-all flex items-center justify-center"
                >
                  ENTER
                </button>
              </>
            )}
          </div>
        ))}
      </div>
      <section
        className={`max-w-4xl mx-auto px-4 py-12 ${darkMode ? "text-gray-300" : "text-gray-700"
          }`}
      >

        <h2 className="text-3xl font-bold text-center mb-6">
          Play Wordle Unlimited Online
        </h2>

        <p className="mb-6 text-lg leading-8 text-center">
          WordleMania is a free Wordle Unlimited game where you can play unlimited
          word puzzles online anytime. Guess 5-letter words, improve your
          vocabulary, maintain your winning streak, and challenge yourself with
          endless Wordle-style puzzles without waiting for the next day.
        </p>

        <p className="mb-6 leading-8">
          Unlike the classic daily Wordle game, Wordle Unlimited allows players to
          continue solving new puzzles as many times as they want. Whether you are a
          beginner learning new words or a puzzle expert looking for a challenge,
          WordleMania provides one of the best unlimited word game experiences
          online for free.
        </p>

        <h3 className="text-2xl font-bold mt-10 mb-4">
          What is Wordle Unlimited?
        </h3>

        <p className="mb-6 leading-8">
          Wordle Unlimited is an online word guessing game inspired by the famous
          Wordle puzzle format. Players have six attempts to guess a hidden
          5-letter word. After every guess, tile colors help reveal whether letters
          are correct, misplaced, or not included in the word.
        </p>

        <p className="mb-6 leading-8">
          Green tiles indicate correct letters in the correct position, yellow tiles
          show correct letters placed in the wrong position, and gray tiles indicate
          letters that are not part of the hidden word. This simple yet addictive
          gameplay makes Wordle Unlimited one of the most popular online word puzzle
          games.
        </p>

        <h3 className="text-2xl font-bold mt-10 mb-4">
          Why Play WordleMania?
        </h3>

        <ul className="list-disc pl-6 space-y-3 mb-8 leading-8">
          <li>Play unlimited Wordle games online for free</li>
          <li>Improve vocabulary and spelling skills</li>
          <li>Track your streaks and game statistics</li>
          <li>Mobile-friendly and fast gameplay experience</li>
          <li>Share scores with friends instantly</li>
          <li>No downloads or signup required</li>
          <li>Enjoy endless 5-letter word puzzles anytime</li>
        </ul>

        <h3 className="text-2xl font-bold mt-10 mb-4">
          Unlimited Word Puzzle Fun
        </h3>

        <p className="mb-6 leading-8">
          If you enjoy word puzzle games, daily word challenges, vocabulary games,
          and brain-training activities, WordleMania offers an engaging experience
          that keeps players coming back every day. The game is designed to be fast,
          responsive, and enjoyable on both desktop and mobile devices.
        </p>

        <p className="mb-6 leading-8">
          Whether you want to casually play a quick word game or spend hours solving
          unlimited puzzles, Wordle Unlimited provides endless entertainment for
          players of all ages.
        </p>

        <h3 className="text-2xl font-bold mt-10 mb-4">
          Start Playing Wordle Unlimited Now
        </h3>

        <p className="leading-8">
          Start playing Wordle Unlimited online for free with WordleMania today.
          Challenge your brain, guess hidden words, improve your vocabulary, and
          enjoy one of the best online word puzzle games available.
        </p>

      </section>
    </main>
  );
}