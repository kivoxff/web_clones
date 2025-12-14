export default function GameOverDisplay({ score, highScore, resetGame }) {
    return (
        <div className='w-2/3 p-3 absolute top-[50%] left-[50%] transform -translate-[50%] z-2 text-center bg-gray-700 rounded-2xl shadow-black shadow-2xl opacity-95'>
            <h2 className='text-white text-3xl font-bold mb-2 '>Game Over</h2>
            <p className='text-white flex justify-around font-bold mb-2'><span className='text-amber-300'>Score: {score}</span> <span className='text-red-400'>High Score: {highScore}</span></p>
            <button onClick={resetGame} className='bg-green-600 p-2 text-white font-bold rounded-2xl cursor-pointer transform active:scale-90 transition-transform'>Play Again</button>
        </div>
    )
}