export default function GameStartDisplay({ setStartOfGame, playSound, gameStart }) {
    return (
        <div className="text-center">
            <h1 className="text-5xl text-green-500 font-bold mb-6">🐍 Snake Game 🎮</h1>
            <div className="max-w-md mx-auto mb-6 text-gray-300 text-center px-4">
                <p className="mb-2">Control the snake with arrow keys (desktop) or buttons (mobile)</p>
                <p className="text-sm text-gray-400">Eat the red food to grow. Don't hit walls or yourself!</p>
                <p className="text-sm text-yellow-400 mt-2">Speed increases as you score</p>
            </div>
            <button onClick={() => {
                setStartOfGame(false);
                playSound(gameStart);
            }} className="px-8 py-4 font-bold text-lg bg-blue-500 hover:bg-blue-600 text-white rounded-lg cursor-pointer shadow-lg active:scale-95 transition-transform">Start Game</button>
        </div>
    )
}