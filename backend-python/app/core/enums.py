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
    UPDATE_COMPANY = "update_company"
    VIEW_COMPANY = "view_company"
    VIEW_CANDIDATE_PROFILE = "view_candidate_profile"
    UPDATE_CANDIDATE_PROFILE = "update_candidate_profile"
    VIEW_OWN_APPLICATIONS = "view_own_applications"
    WITHDRAW_APPLICATION = "withdraw_application"