import React from 'react'
import Button from './Button'
import { Link } from 'react-router-dom'
import DisplaySlider from './DisplaySlider'

const Inspo = ({title= "Inspiration",description="", inspos = []}) => {
  return (
    <div className="w-full h-full mt-20 pt-5">
    <div className="m-4 flex justify-center items-center">
      <div className="w-[650px] text-center">
      <h1 className="text-2xl pb-2 font-semibold">{title}</h1>
      <h2 className=" font-semibold">{description}Explore how the Maison Sommeil Family style our trending pieces</h2>
    
      </div>
    </div>

      <div className="mt-5">
         <div
        className="flex overflow-x-auto scroll-smooth scrollbar-hide"
      >
        {inspos.map((inspo) => (
          <Link
            key={inspo.id}
            to={`/inspo/${inspo.id}`}
            state={{ inspo }}
            className="min-w-[300px] shadow-md rounded-lg overflow-hidden"
          ><div className=" aspect-[3/4] max-h-[400px] overflow-hidden rounded-md">
            <img
              src={inspo.image}
              alt={inspo.name}
              className="h-full w-full object-cover rounded"
            />
            </div>

          </Link>
          
        ))}
        
      </div>
      <div className='flex justify-center mt-5 items-center'>
          <Button
        type="Submit"
        label= "View more"
        className=" w-[148px] h-[48px] p-2 bg-[#002fa7] text-white rounded-full"
          />
      </div>
      </div>
    </div>
  )
}

export default Inspo