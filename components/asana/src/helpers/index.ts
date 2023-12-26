import { HttpClient } from "@prismatic-io/spectral/dist/clients/http";
import { Task } from "../types/Task";

export async function getSubtasks(
  client: HttpClient,
  taskId: string,
  params: { [key: string]: string | number | undefined }
): Promise<Task[]> {
  const { data: subtaskData } = await client.get(`/tasks/${taskId}/subtasks`, {
    params,
  });
  return subtaskData.data;
}
