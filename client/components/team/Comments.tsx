'use client'
import { useTeam } from '@/context/Team'
import _ from './Comments.module.css'
import { _server } from '@/dto/master';
import { useMessage } from '@/context/Message';
import { NoComments } from './NoComments';

export function Comments() {
  const { team } = useTeam();
  const { newMessage } = useMessage();

  const handleError = () => {
    newMessage(403, 'unnable to send message');
  }

  const sendComment = async () => {
    const response = await fetch(`${_server()}/api/comment/send`, {
      method: 'POST',
      credentials: 'include'
    }).then(async response => {
      return await response.json();
    }).catch(_ => {
      handleError();
    })
  }

  return (
    <div className={_.wrapper}>
      {team && team.comments ? team.comments.map((comment: any) => {
        return (
          <div>
            <h6>
              <span>
                <img src={comment.user.login.avatar} />
              </span>
              {comment.user.displayName}</h6>
            <p>{comment.content}</p>
          </div>
        )
      }): <NoComments />}
    </div>
  );
}