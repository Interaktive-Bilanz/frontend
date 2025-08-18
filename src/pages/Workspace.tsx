import React, { ReactNode } from "react";

type WorkspaceProps = {
  children: ReactNode;
};

const Workspace = ({ children }: WorkspaceProps) => {
  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      {children}
    </div>
  );
};

export default Workspace;
