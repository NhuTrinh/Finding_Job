from app.core.enums import UserRole, Permission

ROLE_PERMISSIONS = {
    UserRole.ADMIN: {
        Permission.MANAGE_USERS,
        Permission.CREATE_JOB,
        Permission.VIEW_JOB,
        Permission.UPDATE_JOB,
        Permission.DELETE_JOB,
        Permission.APPLY_JOB,
        Permission.UPDATE_COMPANY,
        Permission.VIEW_COMPANY
    },
    UserRole.RECRUITER: {
        Permission.CREATE_JOB,
        Permission.VIEW_JOB,
        Permission.UPDATE_JOB,
        Permission.DELETE_JOB,
        Permission.UPDATE_COMPANY,
        Permission.VIEW_COMPANY
    },
    UserRole.CANDIDATE: {
        Permission.VIEW_JOB,
        Permission.APPLY_JOB,
        Permission.VIEW_COMPANY
    },
    UserRole.GUEST: {
        Permission.VIEW_JOB,
        Permission.VIEW_COMPANY
    }
}