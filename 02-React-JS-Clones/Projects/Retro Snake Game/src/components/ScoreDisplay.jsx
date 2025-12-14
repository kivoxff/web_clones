export default function ScoreDisplay({ gameScore, highScore }) {
    return (
        <div className="text-center mb-4 text-white">
            <h1 className="text-2xl font-bold">Score: {gameScore}</h1>
            <h1 className="text-xl font-semibold text-yellow-400">High Score: {highScore}</h1>
        </div>
    )
}