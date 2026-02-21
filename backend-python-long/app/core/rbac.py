from app.core.enums import UserRole, Permission

ROLE_PERMISSIONS = {
    UserRole.ADMIN: {
        Permission.MANAGE_USERS,
        Permission.CREATE_JOB,
        Permission.VIEW_JOB,
        Permission.UPDATE_JOB,
        Permission.DELETE_JOB,
        Permission.APPLY_JOB
    },
    UserRole.RECRUITER: {
        Permission.CREATE_JOB,
        Permission.VIEW_JOB,
        Permission.UPDATE_JOB,
        Permission.DELETE_JOB
    },
    UserRole.CANDIDATE: {
        Permission.VIEW_JOB,
        Permission.APPLY_JOB
    },
}