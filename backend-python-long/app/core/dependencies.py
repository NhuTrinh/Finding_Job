from fastapi import Depends, HTTPException, status
from app.core.enums import UserRole, Permission
from app.core.security import get_current_user
from app.core.rbac import ROLE_PERMISSIONS

def require_permission(required_permission: Permission):

    def permission_checker(current_user: dict = Depends(get_current_user)):
        user_role = UserRole(current_user["role"])

        permissions = ROLE_PERMISSIONS.get(user_role, set())
        if required_permission not in permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions"
            )
        

        return current_user

    return permission_checker