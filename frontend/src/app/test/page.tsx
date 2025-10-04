'use client'
import React, { useState } from 'react'
import { generateTasks } from '@/hooks/generateTasks'

type Props = {}

const page = (props: Props) => {
    const [tasks, setTasks] = useState<any>([]);
    const [data, setData] = useState<any>();
    const [loading, setLoading] = useState(false);
    const getTasks = async () => {
        setLoading(true);
        const tasks = await generateTasks(data);
        console.log(tasks);
        setTasks(tasks);
        setLoading(false);
    }
  return (
    <div className='flex flex-col gap-4 justify-center items-center min-h-screen'>
        <textarea className='w-1/2 h-24 border border-gray-300 rounded-md p-2' name="data" id="" onChange={(e) => setData(e.target.value)}></textarea>
        <button onClick={getTasks} className='bg-blue-500 text-white px-4 py-2 rounded-md'>Get Tasks</button>
        
        <div className='flex flex-col gap-2'>
            {
                tasks.map((task: any, index: number) => (
                    <div className='flex flex-col w-1/2 gap-2 border border-gray-300 rounded-md p-2' key={index}>
                        <p className='font-bold'>{task.task}</p>
                        <p className='text-sm'>{task.description}</p>
                        <p className='text-sm'>{task.type}</p>
                        <p className={`text-sm ${task.priority === 'high' ? 'text-red-500' : task.priority === 'medium' ? 'text-yellow-500' : 'text-green-500'}`}>{task.priority}</p>
                    </div>
                ))
            }
        </div>
        </div>
  )
}

export default page