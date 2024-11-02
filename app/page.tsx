"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [games, setGames] = useState([]);
  const [name, setName] = useState("");
  const [dev, setDev] = useState("");
  const [releaseDate, setReleaseDate] = useState(0);
  const [desc, setDesc] = useState("");
  const [isPlayed, setIsPlayed] = useState(false);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch("https://localhost:7228/api/Game/games");

        if (!response.ok) {
          throw new Error("Failed to fetch games");
        }

        const data = await response.json();
        setGames(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchGames();
  }, []);

  useEffect(() => {
    console.log(games);
  }, [games]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const gameData = {
      name,
      developer: dev,
      releaseDate: Number(releaseDate),
      description: desc,
      isPlayed,
    };

    try {
      const response = await fetch(
        "https://localhost:7228/api/Game/games/add-game",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(gameData),
        }
      );

      if (!response.ok) {
        alert("Failed to add game");
        throw new Error("Failed to add game");
      }

      setName("");
      setDev("");
      setReleaseDate(0);
      setDesc("");
      setIsPlayed(false);
      alert("Game added successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  const deleteGame = async (id: number) => {
    try {
      const response = await fetch(
        `https://localhost:7228/api/Game/games/delete-game/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete game");
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setGames((prevGames) => prevGames.filter((game: any) => game.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main>
      <h1 className="text-5xl">Games Wishlist</h1>
      <section className="max-w-[450px]">
        <h2 className="text-xl">Add a new game to your wishlist:</h2>
        <form onSubmit={handleSubmit} method="POST" className="flex flex-col">
          <label>
            Game name:
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              className="border border-black"
            />
          </label>
          <label>
            Developer of the game:
            <input
              type="text"
              onChange={(e) => setDev(e.target.value)}
              className="border border-black"
            />
          </label>
          <label>
            Release date:
            <input
              type="number"
              onChange={(e) => setReleaseDate(parseInt(e.target.value))}
              className="border border-black"
            />
          </label>
          <label>
            Description:
            <input
              type="text"
              onChange={(e) => setDesc(e.target.value)}
              className="border border-black"
            />
          </label>
          <label>
            Have you played with it?
            <input
              type="checkbox"
              checked={isPlayed}
              onChange={(e) => setIsPlayed(e.target.checked)}
              className="border border-black"
            />
          </label>
          <input type="submit" value="Save" className="border border-black" />
        </form>
      </section>
      <section>
        <h2 className="text-xl">Your saved games:</h2>
        <ul>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {games.map((game: any) => (
            <li key={game.id} className="flex gap-8">
              <h2>{game.name}</h2>
              <p>{game.developer}</p>
              <p>{game.releaseDate}</p>
              <p>{game.description}</p>
              <p>{game.isPlayed ? "Yes" : "No"}</p>
              {game.id > 16 ? (
                <button
                  onClick={() => deleteGame(game.id)}
                  className="text-red-600"
                >
                  Delete Game
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
