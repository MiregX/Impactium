'use client'
import _ from './styles/Comments.module.css'
import { NoComments } from './NoComments';
import { useLanguage } from '@/context/Language.context';
import { LeaveComment } from './LeaveComment';
import { useUser } from '@/context/User.context';
import { UserEntity } from '@/dto/User';
import { Avatar } from './Avatar';

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
        comment.user = new UserEntity(comment.user);
        return (
          <div>
            <h6>
              <Avatar size={16} src={comment.user.avatar} alt={comment.user.displayName} />
              {comment.user.displayName}</h6>
            <p>{comment.content}</p>
          </div>
        )
      }) || <NoComments />}
      {user && <LeaveComment />}
    </div>
  );
}