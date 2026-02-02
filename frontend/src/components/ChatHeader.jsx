import { X, Phone } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">

        {/* Left: Avatar + Info */}
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Right: Call Icon + Close */}
        <div className="flex items-center gap-4">
          <a
            href="https://duostream-v9tp.onrender.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition"
            title="Call"
          >
            <Phone size={20} />
          </a>

          <button onClick={() => setSelectedUser(null)}>
            <X />
          </button>
        </div>

      </div>
    </div>
  );
};

export default ChatHeader;
