"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Game {
  id: number;
  name: string;
  developer: string;
  releaseDate: number;
  description: string;
  isplayed: boolean;
}

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);

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
      setGames((prevGames) => prevGames.filter((game: Game) => game.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const togglePlayed = async (id: number) => {
    try {
      const game = games.find((g: Game) => g.id === id);
      if (!game) return;

      const response = await fetch(
        `https://localhost:7228/api/Game/games/isplayed/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(!game.isplayed),
        }
      );

      if (!response.ok) throw new Error("Failed to toggle played status.");
    } catch (e) {
      console.error(e);
    }
  };

  const onNameSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = games.filter(
      (game) =>
        game.name.toLowerCase().includes(query.toLowerCase()) ||
        game.developer.toLowerCase().includes(query.toLowerCase()) ||
        game.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredGames(filtered);
  };

  const onSort = (value: string) => {
    const sorted = [...(filteredGames.length > 0 ? filteredGames : games)].sort(
      (a, b) => {
        if (value === "name") {
          return a.name.localeCompare(b.name);
        } else if (value === "developer") {
          return a.developer.localeCompare(b.developer);
        } else if (value === "date") {
          return a.releaseDate - b.releaseDate;
        }
        return 0;
      }
    );
    setFilteredGames(sorted);
  };

  return (
    <main>
      <NavigationMenu className="max-w-screen px-6 border-b">
        <div className="container flex h-14 items-center">
          <NavigationMenuList className="flex items-center space-x-6">
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Games
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/add-games" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Add Game
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </div>
      </NavigationMenu>

      <section className="flex flex-col items-center justify-center min-h-[40vh] bg-gradient-to-b from-slate-50 to-white">
        <h1 className="scroll-m-20 text-6xl font-extrabold tracking-tight lg:text-7xl text-center bg-gradient-to-b from-slate-900 to-slate-700 bg-clip-text text-transparent">
          Games Wishlist
        </h1>
        <p className="text-xl text-slate-500 mt-4">
          Keep track of the games you want to play
        </p>
      </section>

      <section className="w-full max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            Your Games Library
          </h2>
          <div className="flex gap-4">
            <input
              type="search"
              placeholder="Search games..."
              className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
              value={searchQuery}
              onChange={(e) => onNameSearch(e.target.value)}
            />
            <select
              className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
              onChange={(e) => onSort(e.target.value)}
            >
              <option value="">Sort by</option>
              <option value="name">Name</option>
              <option value="developer">Developer</option>
              <option value="date">Release Date</option>
            </select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Developer</TableHead>
                <TableHead>Release Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Played</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(filteredGames.length > 0 ? filteredGames : games).map(
                (game: Game) => (
                  <TableRow key={game.id}>
                    <TableCell className="font-medium">{game.name}</TableCell>
                    <TableCell>{game.developer}</TableCell>
                    <TableCell>{game.releaseDate}</TableCell>
                    <TableCell className="whitespace-normal">
                      {game.description}
                    </TableCell>
                    <TableCell>
                      <Switch
                        defaultChecked={game.isplayed}
                        onCheckedChange={() => togglePlayed(game.id)}
                        aria-label="Toggle played status"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {game.id > 16 && (
                          <button
                            onClick={() => deleteGame(game.id)}
                            className="text-sm text-red-600 hover:text-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </main>
  );
}
