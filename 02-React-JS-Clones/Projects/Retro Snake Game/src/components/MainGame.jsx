export default function MainGame({ snakeBody, snakeFood }) {
    return (
        <div id="main-game" className="h-[350px] w-[350px] grid grid-cols-[repeat(18,1fr)] grid-rows-[repeat(18,1fr)] gap-0.5 border-8 border-blue-500 rounded-lg  bg-gray-700">
            {/* Render snake body - head is lighter green than body segments */}
            {
                snakeBody.map((arr, idx) => {
                    return <div key={`snake-${idx}`}
                        className={`${idx === 0 ? 'bg-green-500' : 'bg-green-600'} rounded-sm`} style={{ gridRowStart: arr[0], gridColumnStart: arr[1] }}></div>
                })
            }

            {/* Render food with pulsing animation */}
            {
                <div className="bg-red-600 rounded-full animate-pulse" style={{ gridRowStart: snakeFood[0], gridColumnStart: snakeFood[1] }}></div>
            }
        </div>
    )
}