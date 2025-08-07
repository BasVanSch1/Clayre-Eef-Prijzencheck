import CloseButton from "./CloseButton";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
}) => {
  return (
    <>
      {isOpen && (
        <div className="z-9999 fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white p-8 rounded w-96 relative">
            <CloseButton onClick={onClose} />

            {title ? (
              <h2 className="text-2xl font-bold mb-4">{title}</h2>
            ) : (
              <h2 className="text-2xl font-bold mb-4">Confirmation</h2>
            )}

            {message ? (
              <p>{message}</p>
            ) : (
              <p>Are you sure you want to perform this action?</p>
            )}

            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2 cursor-pointer"
                onClick={onClose}
              >
                {cancelText ? cancelText : "Cancel"}
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
              >
                {confirmText ? confirmText : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmationModal;
