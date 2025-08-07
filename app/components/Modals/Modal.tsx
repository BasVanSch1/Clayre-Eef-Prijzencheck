import CloseButton from "./CloseButton";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, message }) => {
  return (
    <>
      {isOpen && (
        <div className="z-9999 fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white p-8 rounded w-96 relative">
            <CloseButton onClick={onClose} />

            {title ? (
              <h2 className="text-2xl font-bold mb-4">{title}</h2>
            ) : (
              <h2 className="text-2xl font-bold mb-4">Notice</h2>
            )}

            {message ? <p>{message}</p> : <p>This is a default text</p>}

            <div className="flex justify-end mt-4">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                onClick={() => {
                  onClose();
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
