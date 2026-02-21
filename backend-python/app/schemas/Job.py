from pydantic import BaseModel

class Address(BaseModel):
    line: str
    city: str
    country: str

class CreateJob(BaseModel):
    title: str
    jobTitle: str
    salaryMin: int
    salaryMax: int
    address: Address
    employmentType: str
    skills: list[str]
    jobExpertise: list[str]
    jobDomain: list[str]
    description: str

