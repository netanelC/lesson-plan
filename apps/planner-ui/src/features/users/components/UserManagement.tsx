import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  type User,
  type RoleType,
  MIN_PASSWORD_LENGTH,
  ROLE_LABELS,
  ROLES,
} from "@repo/types";
import { MoreVertical, Key, Ban, Trash2, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { api } from "../../../lib/axios";
import { useAuth } from "../../auth/context/AuthContext";
import { ConfirmModal } from "../../../components/ui/ConfirmModal";

export const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToResetPassword, setUserToResetPassword] = useState<User | null>(
    null,
  );
  const [newPassword, setNewPassword] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => api.get<User[]>("/users").then((res) => res.data),
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: RoleType }) =>
      api.patch(`/users/${id}/role`, { role }),
    onSuccess: () => {
      toast.success("תפקיד המשתמש עודכן");
      void queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => toast.error("שגיאה בעדכון תפקיד"),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      api.patch(`/users/${id}/status`, { isActive }),
    onSuccess: () => {
      toast.success("סטטוס המשתמש עודכן בהצלחה");
      void queryClient.invalidateQueries({ queryKey: ["users"] });
      setOpenMenuId(null);
    },
    onError: () => toast.error("שגיאה בעדכון סטטוס משתמש"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/users/${id}`),
    onSuccess: () => {
      toast.success("המשתמש נמחק בהצלחה");
      void queryClient.invalidateQueries({ queryKey: ["users"] });
      setUserToDelete(null);
      setOpenMenuId(null);
    },
    onError: () => toast.error("שגיאה במחיקת המשתמש"),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (data: { id: string; newPassword?: string }) =>
      api.post(`/users/${data.id}/reset-password`, {
        newPassword: data.newPassword,
      }),
    onSuccess: () => {
      toast.success("הסיסמה אופסה בהצלחה");
      setOpenMenuId(null);
      setUserToResetPassword(null);
      setNewPassword("");
    },
    onError: () => toast.error("שגיאה באיפוס סיסמה"),
  });

  if (isLoading) return <div>טעינת משתמשים...</div>;

  return (
    <div className="space-y-6" dir="rtl">
      <h1 className="text-2xl font-bold text-gray-900">
        ניהול משתמשים והרשאות
      </h1>
      <div className="bg-white shadow-md rounded-lg border border-gray-200">
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
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase w-16">
                פעולות
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 min-h-[300px]">
            {users?.map((user) => (
              <tr key={user.id} className={!user.isActive ? "bg-gray-50" : ""}>
                <td
                  className={`px-6 py-4 flex items-center gap-3 ${!user.isActive ? "opacity-60" : ""}`}
                >
                  <img
                    src={user.avatarUrl ?? ""}
                    className="h-8 w-8 rounded-full bg-gray-200"
                    alt=""
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="text-sm font-bold flex items-center gap-2">
                      {user.fullName}
                      {!user.isActive && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                          מושעה
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td
                  className={`px-6 py-4 ${!user.isActive ? "opacity-60" : ""}`}
                >
                  <select
                    value={user.role}
                    onChange={(e) =>
                      roleMutation.mutate({
                        id: user.id,
                        role: e.target.value as RoleType,
                      })
                    }
                    className="text-sm border-gray-300 rounded-md focus:ring-indigo-500 disabled:bg-transparent disabled:text-gray-500 disabled:border-transparent disabled:appearance-none font-medium"
                    disabled={
                      user.role === "OWNER" || currentUser.role !== "OWNER"
                    }
                  >
                    {ROLES.map((role) => (
                      <option key={role} value={role}>
                        {ROLE_LABELS[role]}
                      </option>
                    ))}
                  </select>
                </td>
                <td
                  className={`px-6 py-4 text-sm text-gray-500 text-right ${!user.isActive ? "opacity-60" : ""}`}
                  dir="ltr"
                >
                  {new Date(user.createdAt).toLocaleDateString("he-IL", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </td>
                <td className="px-6 py-4 text-left relative">
                  {(currentUser.role === "OWNER" ||
                    currentUser.id === user.id) && (
                    <>
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === user.id ? null : user.id)
                        }
                        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-500" />
                      </button>

                      {openMenuId === user.id && (
                        <div
                          ref={menuRef}
                          className="absolute left-6 bottom-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50 py-1 translate-y-full"
                        >
                          <button
                            onClick={() => {
                              setUserToResetPassword(user);
                              setOpenMenuId(null);
                            }}
                            className="w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                          >
                            <Key className="w-4 h-4 text-gray-500" />
                            איפוס סיסמה
                          </button>

                          {currentUser.role === "OWNER" && (
                            <button
                              onClick={() =>
                                statusMutation.mutate({
                                  id: user.id,
                                  isActive: !user.isActive,
                                })
                              }
                              className="w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                              disabled={user.id === currentUser.id}
                            >
                              {user.isActive ? (
                                <>
                                  <Ban className="w-4 h-4 text-orange-500" />
                                  השעיית משתמש
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                  הפעלת משתמש
                                </>
                              )}
                            </button>
                          )}

                          <button
                            onClick={() => setUserToDelete(user)}
                            className="w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors disabled:opacity-50"
                            disabled={
                              currentUser.role === "OWNER" &&
                              user.id === currentUser.id
                            }
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                            מחיקת משתמש
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={userToDelete !== null}
        onClose={() => setUserToDelete(null)}
        onConfirm={() => userToDelete && deleteMutation.mutate(userToDelete.id)}
        title="מחיקת משתמש"
        message={`האם את/ה בטוח/ה שברצונך למחוק את המשתמש ${userToDelete?.fullName}? פעולה זו היא בלתי הפיכה.`}
        confirmText="מחק משתמש"
        cancelText="ביטול"
      />

      {userToResetPassword && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              aria-hidden="true"
              onClick={() => setUserToResetPassword(null)}
            ></div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div
              className="inline-block px-4 pt-5 pb-4 overflow-hidden text-right align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
              dir="rtl"
            >
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-right w-full">
                  <h3
                    className="text-lg font-medium leading-6 text-gray-900"
                    id="modal-title"
                  >
                    איפוס סיסמה עבור {userToResetPassword.fullName}
                  </h3>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      סיסמה חדשה
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="הזן סיסמה חדשה"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  disabled={
                    !newPassword ||
                    newPassword.length < MIN_PASSWORD_LENGTH ||
                    resetPasswordMutation.isPending
                  }
                  className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm disabled:opacity-50"
                  onClick={() =>
                    resetPasswordMutation.mutate({
                      id: userToResetPassword.id,
                      newPassword,
                    })
                  }
                >
                  {resetPasswordMutation.isPending ? "מאפס..." : "שמור סיסמה"}
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:mr-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setUserToResetPassword(null);
                    setNewPassword("");
                  }}
                >
                  ביטול
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
