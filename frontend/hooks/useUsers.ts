import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService, UserQueryParams } from '../services/users.service';
import { UserFormData } from '../schemas/user.schema';

export const USERS_QUERY_KEY = ['users'];

export function useUsersQuery(params?: UserQueryParams) {
  return useQuery({
    queryKey: [...USERS_QUERY_KEY, params],
    queryFn: () => usersService.getUsers(params),
  });
}

export function useUserQuery(id: string) {
  return useQuery({
    queryKey: [...USERS_QUERY_KEY, id],
    queryFn: () => usersService.getUserById(id),
    enabled: !!id,
  });
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UserFormData) => usersService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UserFormData> }) =>
      usersService.updateUser(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...USERS_QUERY_KEY, id] });
    },
  });
}

export function useUpdateUserStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      usersService.updateUserStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...USERS_QUERY_KEY, id] });
    },
  });
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
}
