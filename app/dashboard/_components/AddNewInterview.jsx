"use client"

import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { chatSession } from '@/utils/GeminiAiModel';
import { LoaderCircle } from 'lucide-react';
import { MockInterview } from '@/utils/schema';
import { db } from '@/utils/db';
import { useUser } from '@clerk/nextjs';
import moment from 'moment/moment';
import { useRouter } from 'next/navigation';
  
const AddNewInterview = () => {
    const [openDialog, setOpenDialog]=useState(false);
    const [jobPosition, setJobPosition]=useState();
    const [jobDesc, setJobDesc]=useState();
    const [jobExperience, setJobExperience]=useState();
    const[loading, setLoading]=useState(false);
    const [jsonResponse, setJsonResponse]=useState([]);
    const {user}=useUser();
    const router=useRouter();

    const onSubmit=async(e)=>{
      setLoading(true);
        e.preventDefault()
        console.log(jobDesc, jobExperience, jobPosition);

      const Inputpromt="job position: "+jobPosition+"; jobDescription: "+jobDesc+"; YearsOfExperience: "+jobExperience+", Depending on provided info provide "+process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT+" questions and answers in Json format with question and answer as json fields"
        
     const result=await chatSession.sendMessage(Inputpromt);
     const MockJsonResp=(result.response.text()).replace('```json', '').replace('```', '')
     console.log(JSON.parse(MockJsonResp));
     setJsonResponse(MockJsonResp)

     if(MockJsonResp){
     const resp=await db.insert(MockInterview)
     .values({
        mockId:uuidv4(),
        jsonMockResp:MockJsonResp,
        jobPosition:jobPosition,
        jobExperience:jobExperience,
        jobDesc:jobDesc,
        createdBy:user?.primaryEmailAddress?.emailAddress,
        createdAt:moment().format('DD-MM-YYYY')
     }).returning({mockId:MockInterview.mockId});
     
     console.log("Inserted ID: ", resp);
       
     if(resp)
      {
        setOpenDialog(false);
        router.push('/dashboard/interview/'+resp[0]?.mockId)
      }

    }
    else{console.log('ERROR')}

     setLoading(false);
    }

    return (
    <div>
      <div className='p-10 border rounded-lg bg-secondary
      hover:scale-105 hover:shadow-md cursor-pointer transition-all'
      onClick={()=>setOpenDialog(true)}
      >
          <h2 className='font-bold text-lg text-center' >+ Add New</h2>
      </div>

      <Dialog open={openDialog}>

  <DialogContent className='max-w-2xl'>
    <DialogHeader>
      <DialogTitle className='text-2xl'>Tell us more about your interview</DialogTitle>
      <DialogDescription>
        <form onSubmit={onSubmit}>
        <div>
            <h2>Add Details about your job position/role, job description and years of experience</h2>
           
           <div className='mt-7 my-2'>
                <label>Job Role/Job Position</label>
               <Input className="mt-2" placeholder="Ex. Full Stack Developer" required
               onChange={(event)=>setJobPosition(event.target.value)}
               />
           </div>

           <div className='mt-7 my-2'>
                <label>Job Description/ Tech Stack (In short) </label>
               <Textarea className="mt-2" placeholder="Ex. React, Angular, Node.js, Mysql etc" required
                onChange={(event)=>setJobDesc(event.target.value)}

               />
           </div>

           <div className='mt-7 my-2'>
                <label>Years of experience</label>
               <Input className="mt-2" placeholder="Ex.4" type="number"  required
               onChange={(event)=>setJobExperience(event.target.value)}

               />
           </div>
        
        </div>
       
        <div className='flex gap-5 justify-center'>
            <Button type="button" variant="ghost" onClick={()=>setOpenDialog(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading?
              <>
              <LoaderCircle className='animate-spin'/>'Generating from AI'
              </>:

               'Start Interview '  
            }
              </Button>
        </div>
        </form>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>


    </div>
  )
}

export default AddNewInterview
