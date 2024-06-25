'use client'
import { useTeam } from '@/context/Team'
import _ from './Comments.module.css'
import { useApplication } from '@/context/Application';
import { NoComments } from './NoComments';
import { useLanguage } from '@/context/Language';
import { LeaveComment } from './LeaveComment';
import { useUser } from '@/context/User';

export function Comments() {
  const { team } = useTeam();
  const { user } = useUser();
  const { newMessage } = useApplication();
  const { lang } = useLanguage();

  const handleError = () => {
    newMessage(403, 'unnable to send message');
  }

  return (
    <div className={_._}>
      <h4>{lang.comments.title}</h4>
      {team.comments?.map((comment: any) => {
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
      }) || <NoComments />}
      {user && <LeaveComment />}
    </div>
  );
}