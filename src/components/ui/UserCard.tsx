import { type IUser } from "../../types/index.types";
import { Link } from "react-router-dom";

export default function UserCard({ user }: { user: IUser }) {
  return (
    <figure className="flex gap-4">
      <img
        src={user.avatar || "/user.png"}
        alt={user.name}
        className="w-10 h-10 rounded-full object-cover"
      />
      <figcaption>
        <p className="font-medium text-gray-900">{user.name}</p>
        <Link to={`/profile/${user.userName}`} className="text-xs text-gray-500">@{user.userName}</Link>
      </figcaption>
    </figure>
  );
}
