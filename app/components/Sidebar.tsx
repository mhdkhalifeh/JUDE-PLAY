export default function Sidebar() {
  return (
    <div className="space-y-6 sticky top-24">

      <div className="bg-[#0f172a] p-4 rounded-2xl">
        <h2 className="text-xl font-bold mb-3">
          🔥 Most Played
        </h2>

        <div className="space-y-2 text-sm text-gray-300">
          <p>Subway Surfers</p>
          <p>Car Parking Simulator</p>
          <p>2048</p>
        </div>
      </div>

      <div className="bg-[#0f172a] p-4 rounded-2xl">
        <h2 className="text-xl font-bold mb-3">
          🆕 New Games
        </h2>

        <div className="space-y-2 text-sm text-gray-300">
          <p>Hextris</p>
          <p>Flappy Bird</p>
          <p>Space Invaders</p>
        </div>
      </div>

      <div className="bg-[#0f172a] p-4 rounded-2xl">
        <h2 className="text-xl font-bold mb-3">
          🏆 Leaderboard
        </h2>

        <div className="space-y-2 text-sm text-gray-300">
          <p>Player1 - 9200</p>
          <p>Player2 - 8700</p>
          <p>Player3 - 8100</p>
        </div>
      </div>

    </div>
  );
}