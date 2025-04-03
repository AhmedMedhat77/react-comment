import { useEffect, useState } from "react";
import { getComments as getCommentsAPI, IComment } from "../api/API";
import Comment from "./Comment";
import CommentForm from "./CommentForm";

type ICommentListProps = {
  currentUserId: string;
};

const CommentList = ({ currentUserId }: ICommentListProps) => {
  const [backendComments, setBackEndComments] = useState<IComment[]>([]);
  const [activeComment, setActiveComment] = useState<{
    type: "edit" | "reply";
    commentId: string;
  } | null>(null);

  const rootComments = backendComments.filter((v) => v.parentId === null);
  const getReplies = (commentId: string) => {
    return backendComments
      .filter((v) => v.parentId === commentId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  };

  const addComment = (text: string, parentId?: string | undefined) => {
    const newComment: IComment = {
      body: text,
      parentId: parentId ?? null,
      createdAt: new Date().toISOString(),
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUserId,
      username: "Ahmed Medhat",
    };

    setBackEndComments((prev) => [newComment, ...prev]);
    setActiveComment(null);
  };

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm("Are You sure that you want to delete this comment ?")) {
      setBackEndComments((prev) => prev.filter((v) => v.id !== commentId));
    }
  };

  const handleUpdateComment = (text: string, commentId?: string | null) => {
    const updatedComments = backendComments.map((comment) => {
      if (comment.id === commentId) {
        return { ...comment, body: text };
      }
      return comment;
    });
    setBackEndComments(updatedComments);
    setActiveComment(null);
  };

  useEffect(() => {
    getCommentsAPI().then((data) => {
      setBackEndComments(data);
    });
  }, []);

  return (
    <div className="comments">
      <h3 className="comments-title">Comments</h3>
      <div className="comment-form-title">
        Write Comment
        <CommentForm handleSubmit={(e) => addComment(e)} submitLabel="Add Comment" />
      </div>

      <div className="comments-container">
        {rootComments?.map((rootComment) => (
          <Comment
            key={rootComment.id}
            comment={rootComment}
            replies={() => getReplies(rootComment.id)}
            currentUserId={currentUserId}
            deleteComment={handleDeleteComment}
            activeComment={activeComment}
            setActiveComment={setActiveComment}
            addComment={(text: string, parentId?: string) => addComment(text, parentId)}
            updateComment={(text, commentId) => handleUpdateComment(text, commentId)}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentList;
