export interface UserRightsResponse {
    user_id: string;
    username: string;
    effectivePermissions: {
        can_view_a: boolean;
        can_view_b: boolean;
        can_view_c: boolean;
        other_perm: Record<string, any>;
    };
    calculated_at: string;
}