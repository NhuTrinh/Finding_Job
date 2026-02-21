from enum import Enum


class UserRole(str, Enum):
    ADMIN = "admin"
    RECRUITER = "recruiter"
    CANDIDATE = "candidate"
    GUEST = "guest"

class Permission(str, Enum):
    MANAGE_USERS = "manage_users"
    CREATE_JOB = "create_job"
    VIEW_JOB = "view_job"
    UPDATE_JOB = "update_job"
    DELETE_JOB = "delete_job"
    APPLY_JOB = "apply_job"
    