import React from 'react';
function MovieDetailMediaSection({movie}) {
    const mediNav=[
        {title:"Most Popular",
            
        },
        {
            title:"Videos",
            length:movie?.videos?.results.length||0
        },
        {title:"Backdrops",
            length:movie?.backdrops?.length||0
        },
        {title:"Posters",
            length:movie?.posters?.length||0
        }
        
    ]
    
  return (
    <div className='bg-amber-400 h-[40vh] w-full '>
        <div className="upperMediaNav flex gap-10 items-center">
                <h2 className='font-semibold text-xl'>Media</h2>
                <div className="mediaNavButtons flex gap-7 items-center">
                    {mediNav.map((item,i)=>{
                        return(
                            <>
                            <h2 key={i} className='cursor-pointer text-[1vw] font-semibold hover:text-amber-200 transition-colors duration-300'>{item?.title}</h2>
                           {item?.length > 0 && (
                            <span className='text-xs bg-[#D7D7D7] text-black rounded-full px-1 py-0.5'>{item?.length}</span>
                           )}
                            </>

                        )
                    })}
                </div>
        </div>
    </div>
  )
}

export default MovieDetailMediaSection