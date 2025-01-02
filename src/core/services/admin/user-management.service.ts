import { PaginatedList } from "@src/core/types/paginated-list.type"
import { PaginationParams } from "@src/core/types/pagination-params.type"
import { UserResponse } from "@src/core/types/user.type"
import { IRequestBuilder, RequestBuilder } from "@src/core/utils/api/request-builder"
import { httpClient } from "@src/core/utils/api"

interface IUserManagementService {
    getPaginatedUsers(params: PaginationParams): Promise<PaginatedList<UserResponse>>;
    getUserById(id: number): Promise<UserResponse>;
    deleteUser(id: number): Promise<void>;
}

class UserManagementService implements IUserManagementService {
    private static instance: UserManagementService;
    private requestBuilder: IRequestBuilder;

    private constructor(requestBuilder: IRequestBuilder) {
        this.requestBuilder = requestBuilder;
    }

    public static getInstance(requestBuilder: IRequestBuilder): UserManagementService {
        if (!UserManagementService.instance) {
            UserManagementService.instance = new UserManagementService(requestBuilder);
        }
        return UserManagementService.instance;
    }

    public async getPaginatedUsers(params: PaginationParams): Promise<PaginatedList<UserResponse>> {
        const { payload } = await httpClient.get<PaginatedList<UserResponse>>({
            url: this.requestBuilder.buildUrl(),
            config: { params },
        });

        return payload;
    }

    public async getUserById(id: number): Promise<UserResponse> {
        const { payload } = await httpClient.get<UserResponse>({
            url: this.requestBuilder.buildUrl(`${id}`),
        });

        return payload;
    }

    public async deleteUser(id: number): Promise<void> {
        await httpClient.delete({
            url: this.requestBuilder.buildUrl(`users/${id}`),
        });
    }
}
const requestBuilder = new RequestBuilder();
requestBuilder.setResourcePath("users");
export const userManagementService = UserManagementService.getInstance(requestBuilder);

