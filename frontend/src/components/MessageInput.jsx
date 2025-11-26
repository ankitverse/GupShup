import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();
  const [sendingImage, setSendingImage] = useState(false);


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
  e.preventDefault();
  if (!text.trim() && !imagePreview) return;

  try {
    setSendingImage(true); // <-- start animation

    await sendMessage({
      text: text.trim(),
      image: imagePreview,
    });

    // Clear form
    setText("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  } catch (error) {
    console.error("Failed to send message:", error);
  } finally {
    setSendingImage(false); // <-- stop animation
  }
};

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className={`w-20 h-20 object-cover rounded-lg border border-zinc-700 
      transition-all duration-300
      ${sendingImage ? "opacity-40 blur-[1px]" : "opacity-100"}
    `}
            />

            {/* Loading Spinner */}
            {sendingImage && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="loading loading-spinner loading-sm text-primary"></span>
              </div>
            )}

            {!sendingImage && (
              <button
                onClick={removeImage}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
                type="button"
              >
                <X className="size-3" />
              </button>
            )}
          </div>

        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          {/* IMAGE BUTTON */}
          <button
            type="button"
            className={`
      btn btn-circle btn-xs sm:btn-sm md:btn-md
      button-switch
      ${text.trim() || imagePreview ? "button-hide hidden" : "button-show flex"}
      sm:button-show
      ${imagePreview ? "text-emerald-500" : "text-zinc-400"}
  `}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        {/* SEND BUTTON */}
        <button
          type="submit"
          className={`
      btn btn-circle btn-xs sm:btn-sm md:btn-md
      button-switch
      ${text.trim() || imagePreview ? "button-show flex" : "button-hide hidden"}
      sm:button-show
  `}
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>

        

      </form>
    </div>
  );
};
export default MessageInput;
