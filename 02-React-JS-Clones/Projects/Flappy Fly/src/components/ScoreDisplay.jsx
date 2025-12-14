export default function ScoreDisplay({ score }) {
    return (
        <span className='font-mono text-5xl text-white absolute top-1 left-[50%] transform -translate-x-[50%]'>{score}</span>
    )
}