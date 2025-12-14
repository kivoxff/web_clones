import CharacterSelection from "./CharacterSelection";

export default function StartDisplay({ updateCharSrc, CHAR_SRC, setStartOfGame }) {
    return (
        <div className='w-2/3 p-3 absolute top-[50%] left-[50%] transform -translate-[50%] z-2 text-center bg-gray-700 rounded-2xl shadow-black shadow-2xl'>
            {/* Game Title */}
            <h2 className='text-blue-300 text-2xl font-bold mb-2'>Flappy Fly</h2>

            {/* seperation */}
            <hr className='text-white mb-2' />

            {/* Game Instructions */}
            {/* Instructions for mobile + md (smaller than lg) */}
            <p className='text-gray-300 text-xs mb-3 block lg:hidden'>
                <span className='font-semibold'>How to play:</span> <br />
                <span className='font-bold'>Tap</span> the screen to flap
            </p>

            {/* Instructions for desktop only (lg and above) */}
            <p className='text-gray-300 text-xs mb-3 hidden lg:block'>
                <span className='font-semibold'>How to play:</span> <br />
                Press <span className='font-bold'>Space</span> or <span className='font-bold'>Up Arrow</span> to flap
            </p>


            {/* Character selection title */}
            <h3 className='text-white text-lg font-semibold mb-2'>Choose Your Character (Fish is default)</h3>

            {/* Character selection */}
            <CharacterSelection updateCharSrc={updateCharSrc} CHAR_SRC={CHAR_SRC} />

            {/* seperation */}
            <hr className='text-white' />

            {/* Start button */}
            <button
                onClick={() => setStartOfGame(false)}
                className='mt-2 bg-red-500 p-2 text-white font-bold rounded-2xl cursor-pointer transform active:scale-90 transition-transform text-sm'
            >
                Start Game
            </button>
        </div>
    )
}