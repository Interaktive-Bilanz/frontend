import React, { ReactNode } from "react";

type WorkspaceProps = {
  children: ReactNode;
};

function Workspace({ children }: WorkspaceProps) {
  return (
    <div className="flex justify-center min-h-screen bg-gray-100 p-4">
      {children}
    </div>
  );
}

export default Workspace;
