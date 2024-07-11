import React from 'react'
import Interview from '../interview/[interviewId]/page'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const InterviewItemCard = ({interview}) => {

   const router=useRouter();

   const onStart=()=>{
     router.push('/dashboard/interview/'+interview?.mockId)
   }

   const onFeedback=()=>{
    router.push('/dashboard/interview/'+interview.mockId+'/feedback');
   }
  return (
    <div className='border shadow-sm rounded-lg p-3'>
      <h2 className='font-bold text-blue-600'>{interview?.jobPosition}</h2>
      <h2 className='text-sm text-gray-600'>{interview?.jobExperience} Years of experience</h2>
      <h2 className='text-sm text-gray-500'>Created At: {interview?.createdAt} </h2>
    
     <div className='flex justify-between mt-2'>
        <Button size="sm" variant="outline"
        onClick={onFeedback} >FeedBack</Button>
        <Button size="sm" onClick={onStart}  >Start</Button>
     </div>
    
    </div>
  )
}

export default InterviewItemCard
