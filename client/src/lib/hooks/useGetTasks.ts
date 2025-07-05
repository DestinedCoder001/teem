import { useQuery } from "@tanstack/react-query";
import api from "../axios";
import { currentWs } from "../store/userStore";

const useGetTasks = () => {
  const { wsId } = currentWs((state) => state);
  const {
    data: tasksData,
    isSuccess: getTasksSuccess,
    isPending,
  } = useQuery({
    queryKey: ["get-user-tasks", wsId],
    queryFn: async () => {
      const res = await api.get(`/${wsId}/tasks`);
      return res.data?.data;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
  return { tasksData, getTasksSuccess, isPending };
};

export default useGetTasks;
