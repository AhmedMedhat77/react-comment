import { FormEvent, useState } from "react";

type ICommentFormProps = {
  submitLabel: string;
  handleSubmit: (e: string) => void;
  hasCancelButton?: boolean;
  handleCancel?: () => void;
  initialText?: string;
};
const CommentForm = ({
  handleSubmit,
  submitLabel,
  handleCancel,
  hasCancelButton = false,
  initialText = "",
}: ICommentFormProps) => {
  const [text, setText] = useState(initialText);
  const isTextAreaDisabled = text.length === 0;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSubmit(text);
    setText("");
  };
  return (
    <form onSubmit={onSubmit}>
      <textarea
        className="comment-form-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button disabled={isTextAreaDisabled} className="comment-form-button">
        {submitLabel}
      </button>
      {hasCancelButton && (
        <button
          onClick={handleCancel}
          type="button"
          className=" comment-form-button comment-form-cancel-button"
        >
          Cancel
        </button>
      )}
    </form>
  );
};

export default CommentForm;
