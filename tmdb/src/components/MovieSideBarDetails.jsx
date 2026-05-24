import React from 'react'

function MovieSideBarDetails({movie}) {
    const languageMap = {
    en: "English",
    fr: "French",
    ja: "Japanese",
    ko: "Korean",
    hi: "Hindi",
    ur: "Urdu",
    es: "Spanish",
    de: "German",
    it: "Italian",
    zh: "Chinese",
    ru: "Russian",
    tr: "Turkish",
  };
  const languageCode =movie?.original_language?.toLowerCase();
  const languageName = languageCode?(languageMap[languageCode]||languageCode?.toUpperCase()):"N/A";
    const data=[
        {
            title:"Status",
            value:movie?.status ||"N/A",
        },
        {
            title:"Original Language",
            value:languageName,
        },
        {
            title:"Budget",
            value:movie?.budget?`$${movie.budget.toLocaleString()}`:"N/A",
        },
        {
            title:"Revenue",
            value:movie?.revenue?`$${movie.revenue.toLocaleString()}`:"N/A",
        }
    ]
    
  return (
    <div className='mt-1'>
        
        {
            data.map((item,i)=>{
                return(
                    <div key={i} className='pt-5 '>
                        <h2 className='text-sm font-semibold '>{item.title}</h2>
                        <p className='text-[.9vw] '>{item.value}</p>
                    </div>
                )
            })
        }
    </div>
  )
}

export default MovieSideBarDetails