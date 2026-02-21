from pydantic import BaseModel

class Address(BaseModel):
    line: str
    city: str
    country: str


class CompanyProfile(BaseModel):
    name: str
    logo:str
    type: str
    industry: str
    size: str
    address: Address
    workingDays: str
    Overtime: str
    overview: str
    keySkills: list[str]
    perksContent: str
    fanpageUrl: str
    websiteUrl: str

class CompanyOption(BaseModel):
    id: int
    name: str