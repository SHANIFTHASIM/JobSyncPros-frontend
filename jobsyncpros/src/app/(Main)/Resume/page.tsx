import React from 'react'
import ResumeCreation from './-components/ResumeCreation'
import ResumeStore from '../_components/ResumeStore'

const page = () => {
  return (
    <div>
        
        <div className='p-10 md:px-20 lg:px-32'>
      <h2 className='font-bold text-3xl'>My Resume</h2>
      <p>Start Creating AI resume to your next Job role</p>
      <div className='grid grid-cols-2 
      md:grid-cols-3 lg:grid-cols-5 gap-5
      mt-10
      '>
        <ResumeCreation/>
        
          {/* <ResumeCardItem  /> */}
        
          <div className='h-[280px] rounded-lg bg-slate-200 animate-pulse'>
           created resume  Card items 
          </div>

          <div className='h-[280px] rounded-lg bg-slate-200 animate-pulse'>
           created resume  Card items 
          </div>
          
          <div className='h-[280px] rounded-lg bg-slate-200 animate-pulse'>
           created resume  Card items 
          </div>

                  
      </div>

      
    </div>
        
<div className='p-10 md:px-0 lg:px-2'>

<ResumeStore/>
</div>
        


        </div>
  )
}

export default page