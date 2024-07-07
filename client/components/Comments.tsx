'use client'
import _ from './styles/Comments.module.css'
import { useApplication } from '@/context/Application.context';
import { NoComments } from './NoComments';
import { useLanguage } from '@/context/Language.context';
import { LeaveComment } from './LeaveComment';
import { useUser } from '@/context/User.context';

interface CommentsProps {
  comments: Comment[]
}

export function Comments({ comments }: CommentsProps) {
  const { user } = useUser();
  const { lang } = useLanguage();

  return (
    <div className={_._}>
      <h4>{lang.comments.title}</h4>
      {comments.map((comment: any) => {
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