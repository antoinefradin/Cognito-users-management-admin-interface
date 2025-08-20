from pydantic import BaseModel

# Cognito User

class User(BaseModel):
    id: str
    name: str
    groups: list[str]
    role: str   # instead of "tenant"

    def is_admin(self) -> bool:
        return "Admin" in self.groups

    def is_creating_licenses_and_enterprise_allowed(self) -> bool:
        return self.is_admin() or "LicensesEnterprisesCreationAllowed" in self.groups 

