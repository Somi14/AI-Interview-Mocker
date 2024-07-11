"use client"
import  Webcam  from 'react-webcam'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic } from 'lucide-react'
import { toast } from 'sonner'
import { chatSession } from '@/utils/GeminiAiModel'
import { UserAnswer } from '@/utils/schema'
import moment from 'moment'
import { useUser } from '@clerk/nextjs'
import { db } from '@/utils/db'


const RecordAnswerSection = ({mockInterviewQuestion, activeQuestionIndex, interviewData}) => {
  const[userAnswer, setUserAnswer]=useState('');
  const[loading, setLoading]=useState(false);
  const {user}=useUser();
  const {
    error,
    interimResult,
    isRecording,
    results,
    setResults,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });

   useEffect(()=>{
   results.map((result)=>(
    setUserAnswer(prevAns=>prevAns+result.transcript)
   ))
   }, [results]);

   useEffect(()=>{
    if(!isRecording && userAnswer.length>10)
    {
      UpdateUserAns();
    }
   },[userAnswer])

   const StartStopRecording=async()=>{
    if(isRecording)
    { 
      stopSpeechToText()
       
    }
    else{
      startSpeechToText()
    }
   }

   const UpdateUserAns=async()=>{
    console.log(userAnswer);
    console.log(interviewData);
    setLoading(true);
    const feedBackPrompt="Question:"+mockInterviewQuestion[activeQuestionIndex]?.question+
    ", User Answer:"+userAnswer+",Depends on question and user answer for given interview question"+
    " please give us rating for answer and feedback as area of improvement, if any just in 3 to 5 lines to improve it in"+
    "JSONformat with rating field and feedback field";
    
    const result=await chatSession.sendMessage(feedBackPrompt);

    const mockJsonResp=(result.response.text()).replace('```json', '').replace('```', '')
    console.log(mockJsonResp);

    const JsonFeedbackResp=JSON.parse(mockJsonResp);

    const resp=await db.insert(UserAnswer)
    .values({
      mockIdRef:interviewData[0]?.mockId,
      question:mockInterviewQuestion[activeQuestionIndex]?.question,
      correctAns:mockInterviewQuestion[activeQuestionIndex]?.answer,
      userAns:userAnswer,
      feedback:JsonFeedbackResp?.feedback,
      rating:JsonFeedbackResp?.rating,
      userEmail:user?.primaryEmailAddress?.emailAddress,
      createdAt:moment().format('DD-MM-yyyy')
    })

    if(resp)
    {
      toast('User Answer recorded successfully')
      setUserAnswer('');
      setResults([]);
    }
    
    setResults([]);
    setLoading(false);
   }

  return (
    <div className='flex items-center justify-center flex-col '>
    <div className='flex flex-col mt-20 justify-center items-center bg-secondary rounded-lg p-5'>
      <Image src={'/pngegg.png'} width={200} height={200} alt='webcame'
      className='absolute'/>
      <Webcam
      mirrored={true}
      style={{
        height:300,
        width:'100%',
        zIndex:10,
      }}
      />
    </div>
    <Button
     disabled={loading}
    variant="outline" className="my-10 font-bold"
    onClick={StartStopRecording}>
      {isRecording?
       <h2 className='text-red-600 flex gap-2'>
          <Mic/> 'Stop Recording...'
       </h2>
      :
       'Record Answer'}</Button>
     
    </div>
  )
}

export default RecordAnswerSection
