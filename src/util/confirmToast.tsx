import { toast } from "react-toastify";

export const confirmToast = (message: string, onConfirm: () => void) => {
  toast.info(({ closeToast }) => (
    <div>
      <div>{message}</div>
      <div className="flex gap-2 mt-2">
        <button
          className="px-2 py-1 rounded bg-green-300 hover:bg-green-500 text-black text-sm"
          onClick={(e) => {
            e.stopPropagation();
            onConfirm();
            closeToast();
          }}
        >
          Bestätigen
        </button>
        <button
          className="px-2 py-1 rounded bg-gray-300 hover:bg-gray-500 text-black text-sm"
          onClick={(e) => {
            e.stopPropagation();
            closeToast();
          }}
        >
          Abbrechen
        </button>
      </div>
    </div>
  ), {
    position: "top-center",
    autoClose: false,
    closeOnClick: false,  // prevent accidental dismissal
  });
};