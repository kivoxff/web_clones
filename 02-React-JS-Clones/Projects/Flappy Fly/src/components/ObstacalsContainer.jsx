import React from "react"
export default function ObstacalsContainer({ pipes, V_PIPE_GAPE, PIPE_HEIGHT }) {

    return (pipes.map((pp, idx) => {
        return (
            <React.Fragment key={idx}>
                <div className="bg-[url(../images-icons/fire.gif)]  bg-size-[25%_50%] absolute top-0 left-0" style={{ width: `${pp.w}px`, height: `${pp.h}px`, transform: `translateX(${pp.x}px) translateY(${pp.y + V_PIPE_GAPE + PIPE_HEIGHT}px)` }}>
                    <img src={pp.src} alt="obstacal" className='w-full h-full object-cover' />
                </div>

                <div className="bg-[url(../images-icons/fire.gif)]  bg-size-[25%_50%] absolute top-0 left-0" style={{ width: `${pp.w}px`, height: `${pp.h}px`, transform: `scaleY(-1) translateX(${pp.x}px) translateY(${-pp.y}px)` }}>
                    <img src={pp.src} alt="obstacal" className='w-full h-full object-cover' />
                </div>
            </React.Fragment>
        )
    }))

}