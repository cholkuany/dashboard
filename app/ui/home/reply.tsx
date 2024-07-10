'use client'

import { useState } from "react";
 
export default async function Page() {
    const [replyComment, setReplyComment] = useState(Array<string>);
    const [newComment, setNewComment] = useState('');

    const handlePostComment = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
      if (!newComment.trim()) return; // Avoid adding empty comments
      
      const updatedComments = [
        ...replyComment,
        event.currentTarget.value, // Update 'Anonymous' to dynamically use the user's name if available
      ];
      setReplyComment(updatedComments);
      setNewComment(''); // Clear the input after posting
    };
  return (
    <div className='flex flex-col md:flex-row justify-start gap-5 m-auto sm:w-11/12 md:w-4/5 lg:w-3/5 shadow-md rounded-md overflow-hidden'>
        <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className='flex flex-wrap justify-center items-center w-full p-[10px] rounded-full h-14 resize-none border-2 border-slate-200'
        />
    </div>
)
}