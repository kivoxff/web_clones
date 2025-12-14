export default function GameOverDisplay({ setGameOverState, playSound, gameStart }) {
    return (
        <div className="text-center">
            <h1 className="text-5xl text-red-500 font-bold mb-4 animate-bounce">Game Over!</h1>
            <button onClick={() => {
                setGameOverState(false);
                playSound(gameStart);
            }} className="px-6 py-3 font-bold bg-green-500 hover:bg-green-600 text-white rounded-lg cursor-pointer shadow-lg active:scale-95 transition-transform">Play Again</button>
        </div>
    )
}