export default function ControlerButtons({ playSound, changeDir, setHasStartedMoving, dir }) {
    return (
        <div className="mt-3 grid grid-cols-3 grid-rows-3 md:hidden">
            <button onClick={() => {
                playSound(changeDir);
                setHasStartedMoving(true);
                if (dir.current !== 'down') dir.current = 'up';
            }} className="row-start-1 col-start-2 p-2 bg-green-600 rounded-2xl font-bold text-white cursor-pointer flex items-center justify-center shadow-lg active:scale-95 transition-transform">Up</button>

            <button onClick={() => {
                playSound(changeDir);
                setHasStartedMoving(true);
                if (dir.current !== 'right') dir.current = 'left';
            }} className="row-start-2 col-start-1 p-2 bg-red-500 rounded-2xl font-bold text-white cursor-pointer flex items-center justify-center shadow-lg active:scale-95 transition-transform">Left</button>

            <button onClick={() => {
                playSound(changeDir);
                setHasStartedMoving(true);
                if (dir.current !== 'left') dir.current = 'right';
            }} className="row-start-2 col-start-3 p-2 bg-red-500 rounded-2xl font-bold text-white cursor-pointer flex items-center justify-center shadow-lg active:scale-95 transition-transform">Right</button>

            <button onClick={() => {
                playSound(changeDir);
                setHasStartedMoving(true);
                if (dir.current !== 'up') dir.current = 'down';
            }} className="row-start-3 col-start-2 p-2 bg-green-600 rounded-2xl font-bold text-white cursor-pointer flex items-center justify-center shadow-lg active:scale-95 transition-transform">Down</button>
        </div>
    )
}