export default function CharacterContainer({ char, charSrc }) {
    return (
        <div className="aspect-square z-1 transition-transform ease duration-75 flex justify-center items-center" style={{ width: `${char.size}px`, position: 'absolute', left: `${char.x}px`, top: `${char.y}px`, transform: `translateY(-50%) rotate(${Math.min(Math.max(char.v * 15, -30), 60)}deg)` }}>
            <img src={charSrc} alt="char" className='object-cover' />
        </div>
    )
}