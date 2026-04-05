import { type ReactNode } from "react";
import { useAuth } from "../../features/auth/context/AuthContext";

interface CanProps {
  perform: "edit" | "delete" | "create";
  data?: { authorId: string }; // Needed for ownership checks
  children: ReactNode;
}

export const Can = ({ perform, data, children }: CanProps) => {
  const { user } = useAuth();

  // 1. If not logged in, they can't perform any actions

  // 2. Owners are "Librarians" - they can do anything to any plan
  if (user.role === "OWNER") {
    return <>{children}</>;
  }

  // 3. Kindergartens are "Consumers" - they can never create, edit, or delete
  if (user.role === "KINDERGARTEN") {
    return null;
  }

  // 4. Admins are "Contributors"
  // Admins can always see the "Create" button
  if (perform === "create") {
    return <>{children}</>;
  }

  // Admins can only edit or delete if they are the original author
  return data?.authorId === user.id ? <>{children}</> : null;

};
