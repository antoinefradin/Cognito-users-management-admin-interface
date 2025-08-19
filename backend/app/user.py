from pydantic import BaseModel

# Cognito User

class User(BaseModel):
    id: str
    name: str
    groups: list[str]
    role: str   # instead of "tenant"

    def is_admin(self) -> bool:
        return "Admin" in self.groups

    def is_creating_bot_allowed(self) -> bool:
        return self.is_admin() or "CreatingBotAllowed" in self.groups ### To change for the group name

