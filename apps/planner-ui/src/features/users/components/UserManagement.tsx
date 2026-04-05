import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User, RoleType } from "@repo/types";
import { api } from "../../../lib/axios";

export const UserManagement = () => {
  const queryClient = useQueryClient();
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => api.get("/users").then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: RoleType }) =>
      api.patch(`/users/${id}/role`, { role }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  if (isLoading) return <div>טוען משתמשים...</div>;

  return (
    <div className="space-y-6" dir="rtl">
      <h1 className="text-2xl font-bold text-gray-900">
        ניהול משתמשים והרשאות
      </h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                משתמש
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                תפקיד
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                תאריך הצטרפות
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users?.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 flex items-center gap-3">
                  <img
                    src={user.avatarUrl || ""}
                    className="h-8 w-8 rounded-full bg-gray-200"
                    alt=""
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="text-sm font-bold">{user.fullName}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={user.role}
                    onChange={(e) =>
                      mutation.mutate({
                        id: user.id,
                        role: e.target.value as RoleType,
                      })
                    }
                    className="text-sm border-gray-300 rounded-md focus:ring-indigo-500"
                    disabled={user.role === "OWNER"} // Prevent demoting the owner
                  >
                    <option value="KINDERGARTEN">גננת (צפייה בלבד)</option>
                    <option value="ADMIN">מנהל (יצירת תכנים)</option>
                    <option value="OWNER">בעלים</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString("he-IL")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};