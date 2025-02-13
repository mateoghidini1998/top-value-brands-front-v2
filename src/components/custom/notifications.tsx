import { Bell } from "lucide-react";
import { Button } from "../ui/button";

export const Notifications = () => {
  return (
    <Button className="absolute top-[26px] right-[24px] dark:bg-dark-3">
      <Bell className="w-5 h-5" />
    </Button>
  );
};
