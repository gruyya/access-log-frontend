import { useAuth } from "@/contexts";

const useHandleLogout = () => {
  const { token, signOut } = useAuth();

  const onLogout = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response;

    if (result.status === 204) {
      signOut();
    }
  };

  return { onLogout };
};

export default useHandleLogout;
