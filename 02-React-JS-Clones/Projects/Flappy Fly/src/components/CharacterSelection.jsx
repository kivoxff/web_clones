export default function CharacterSelection({ updateCharSrc, CHAR_SRC }) {
    return (
        <div onClick={updateCharSrc} className='flex justify-around mb-2'>
            {CHAR_SRC.map((src, idx) => (
                <img
                    key={idx}
                    src={src}
                    alt="char"
                    tabIndex={0}  // makes it focusable
                    data-index={idx}
                    className='w-1/4 rounded-2xl cursor-pointer focus:border-amber-300 focus:ring-2 focus:ring-amber-300 transition-all object-contain'
                />
            ))}
        </div>
    )
}