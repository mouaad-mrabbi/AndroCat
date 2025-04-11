interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}
export default function ConfirmBox({
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-[#292c2f] p-5 rounded-lg shadow-lg text-center">
        <p className="text-lg font-bold mb-4">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-white/10 rounded-lg"
          >
            cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            ok
          </button>
        </div>
      </div>
    </div>
  );
}
