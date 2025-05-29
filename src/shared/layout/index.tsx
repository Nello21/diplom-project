import { Outlet } from "react-router";

export const BaseLayout = () => {
  return (
    <div className="h-full w-full flex flex-col p-4">
      <Outlet />
    </div>
  );
};
