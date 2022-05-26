import {GoIssueOpened, GoIssueClosed, GoComment} from 'react-icons/go'
import {relativeDate} from '../helpers/relativeDate'
import { Link } from "react-router-dom";
import { useUserData } from '../helpers/useUserData';
import { Label } from './Label';

export function IssueItem({
    title,
    number,
    assignee,
    commentCount,
    createdBy,
    createdDate,
    labels,
    status
  }) {
    const asigneeUser = useUserData(assignee);
    const createdByUser = useUserData(createdBy);
    return (
      <li>
        <div>
          {status === 'done' || status === 'cancelled' ? 
            (<GoIssueClosed style={{color:'red'}}/>) :
            (<GoIssueOpened style={{color:'green'}}/>)
          }
        </div>
        <div className={'issue-content'}>
          <span>
            <Link to={`issue/${number}`}>{title}</Link>
            {labels.map(label => (
              <Label key={label} label={label} />
            ))}
          </span>
          <small>
            #{number} opened {relativeDate(createdDate)} {createdByUser.isSuccess ? `by ${createdByUser.data.name}` : null}
          </small>
        </div>
        {assignee ? (
          <img
            src={asigneeUser.isSuccess ? asigneeUser.data.profilePictureUrl : ""}
            className={'assigned-to'}
            alt={asigneeUser.isSuccess ? `Assigned to ${asigneeUser.data.name}` : 'Avatar'}
          />
        ) : null}
        <span className={'comment-count'}>
          {commentCount > 0 ? (
            <>
              <GoComment />
              {commentCount}
            </>
          ) : null}
        </span>
      </li>
    );
  }

