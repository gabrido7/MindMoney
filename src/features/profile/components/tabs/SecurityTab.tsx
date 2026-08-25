import ChangePasswordCard from "../ChangePasswordCard";
import SessionsCard from "../SessionsCard";

export default function SecurityTab() {
  return (
    <div className="flex flex-col gap-6">
      <ChangePasswordCard />
      <SessionsCard />
    </div>
  );
}
