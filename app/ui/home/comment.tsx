'use client'

import { MouseEventHandler, useState } from "react";
import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";
import { HandThumbDownIcon } from "@heroicons/react/24/outline";
import { HandThumbUpIcon } from "@heroicons/react/24/outline";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { PhoneIcon } from "@heroicons/react/24/outline";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator";

export default function AddComment({likes, dislikes, desc}:{likes:number, dislikes:number, desc:string}){
    const initialComments = [
        {text: 'good work', author: 'Dan'}, 
        {text: 'Continue the good work', author: 'Kevin'},
        {text: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour', author: 'Peter'},
        {text: 'look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text', author: 'Garang'},
        {text: 'All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet', author: 'Dave'},
        {text: "If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text", author: 'John'}
    ]
    const [comments, setComments] = useState(initialComments);
    const [newComment, setNewComment] = useState('');

    const [like, setLike] = useState(0)
    const [dislike, setDislike] = useState(0)
    const [reply, setReply] = useState([{comment_id: 0, reply: ''}])


    const handleReply = (id: number, event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        setReply((prev) => [...reply, {comment_id: id, reply: event.currentTarget.value}])
    }
    const handleLike = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        setLike((prev) => prev + 1)
    }
    const handleDislike = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        setDislike((prev) => prev + 1)
    }
  
    const handlePostComment = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
      if (!newComment.trim()) return; // Avoid adding empty comments
      
      const updatedComments = [
        ...comments,
        { text: newComment, author: 'Anonymous' }, // Update 'Anonymous' to dynamically use the user's name if available
      ];
      setComments(updatedComments);
      setNewComment(''); // Clear the input after posting
    };

    return (
        <div className='flex-1 md:col-span-2 flex flex-col'>
            <ScrollArea className="h-[70vh] pr-2">
                <div className="flex flex-col">
                    <p className="py-4">
                       {desc}
                    </p>
                    <div className="flex flex-row items-center pl-2 pr-4 pt-4 pb-6 gap-3">
                        <div className="flex flex-col justify-center items-center w-14 h-14 overflow-hidden">
                            <Avatar>
                                <AvatarImage src='/blog-images/cholkuany.jpg' className="object-fill rounded-full w-full h-full"/>
                                <AvatarFallback>CK</AvatarFallback>
                            </Avatar>
                        </div>
                        {/* <div className="flex justify-between w-full"> */}
                            <div className="flex flex-row gap-2 justify-center">
                                <p><span><strong>Chol</strong></span></p>
                                <div className="flex gap-4">
                                    <EnvelopeIcon className="h-6 w-6 text-pink-500" />
                                    <PhoneIcon className="h-6 w-6 text-pink-500" />
                                </div>
                            </div>
                        {/* </div> */}
                    </div>
                    <p className="pt-8 pb-2 text-xl">Comments</p>
                </div>
                {comments.map((comment, index) => (
                    <div key={index} className="block my-4">
                        <div className="flex flex-row">
                            <Avatar className="mr-4">
                                <AvatarImage src={'/blog-images/cholkuan.jpg'}  />
                                <AvatarFallback>{comment.author.slice(0, 1).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col py-1">
                                <p>
                                    <span className="mr-1"><strong>{comment.author}</strong></span> 
                                    {comment.text}
                                </p>
                                <div className="flex gap-4">
                                    <button className="">
                                        <ChatBubbleOvalLeftIcon className="h-6 w-6 text-gray-500 hover:text-pink-500" />
                                    </button>
                                    <button onClick={handleLike} className="flex">
                                        <HandThumbUpIcon className="h-6 w-6 text-gray-500" />
                                        {like > 0 && <span>{like}</span>}
                                    </button>
                                    <button onClick={handleDislike} className="flex">
                                        <HandThumbDownIcon className="h-6 w-6 text-gray-500" />
                                        {dislike > 0 && <span>{dislike}</span>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                   ))}
                {/* </ul> */}
            </ScrollArea>
            <Separator />
            <div className='px-2 pb-2 mx-auto w-full bg-black'>
                <div className="flex justify-between">
                    <p className="text-xl">Comments(0)</p>
                    <button onClick={handleLike} className="flex">
                        <HandThumbUpIcon className="h-6 w-6 text-gray-500" />
                        {likes > 0 && <span>{likes}</span>}
                    </button>
                    <button onClick={handleDislike} className="flex">
                        <HandThumbDownIcon className="h-6 w-6 text-gray-500" />
                        {dislikes > 0 && <span>{dislikes}</span>}
                    </button>
                </div>
                <div className="flex items-center justify-center pt-5">
                    {/* <div className="p-6 mr-1 overflow-hidden flex flex-col justify-center items-center w-8 h-8 rounded-full bg-gray-100">
                        C
                    </div> */}
                    <Avatar className="mr-1">
                        <AvatarImage src='/blog-images/cholkuany.jpg' className="object-cover rounded-full w-full h-full"/>
                        <AvatarFallback>C</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-nowrap relative justify-center items-center w-full">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className='flex flex-wrap justify-center items-center w-full p-[10px] pr-7 rounded-full h-14 resize-none border-2 border-slate-200'
                        /> 
                        <button 
                          onClick={handlePostComment} className='absolute right-1 inline-block my-auto p-2 rounded-full bg-pink-400'>
                          <PaperAirplaneIcon className="h-6 w-6 text-white" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}