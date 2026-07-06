import { type ReactNode } from "react";
import { useAuth } from "../../features/auth/context/AuthContext";

interface CanProps {
  perform: "edit" | "delete" | "create" | "viewUsers" | "manageUsers";
  data?: { authorId: string }; // Needed for ownership checks
  children: ReactNode;
}

export const Can = ({ perform, data, children }: CanProps) => {
  const { user } = useAuth();

  // Owners are "Librarians" - they can do anything to any plan and manage users
  if (user.role === "OWNER") {
    return <>{children}</>;
  }

  // manageUsers is strictly OWNER only
  if (perform === "manageUsers") {
    return null;
  }

  // Kindergartens are "Consumers" - they can never create, edit, delete, or view users
  if (user.role === "KINDERGARTEN") {
    return null;
  }

  // Admins are "Contributors"
  // Admins can always see the "Create" button and can view users
  if (perform === "create" || perform === "viewUsers") {
    return <>{children}</>;
  }

  // Admins can only edit or delete if they are the original author
  return data?.authorId === user.id ? <>{children}</> : null;
};
