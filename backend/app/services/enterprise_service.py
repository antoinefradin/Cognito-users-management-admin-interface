from app.routes.schemas.entreprise import (
    EnterpriseInput,
    EnterpriseOutput,
    IndustryEnum,
    CompanySizeEnum,
    EnterpriseStatusEnum,
    SubscriptionTierEnum,
)
from app.repositories.models.enterprise import (
    EnterpriseModel,
)
from app.repositories.enterprise_repository import (
    store_enterprise,
)
from app.utils import (
    get_current_time,
)





def create_new_bot(user_id: str, enterprise_input: EnterpriseInput) -> EnterpriseOutput:
    """Create a new enterprise."""
    current_time = get_current_time()

    store_enterprise(
        user_id,
        EnterpriseModel(
            id=enterprise_input.id,
            name=enterprise_input.name,
            industry=enterprise_input.industry,
            size=enterprise_input.size, #  if enterprise_input.size else "enterprise",
            contact_email=enterprise_input.contact_email,
            contact_phone=enterprise_input.contact_phone, # if enterprise_input.contact_phone else "",
            address=enterprise_input.address, # if enterprise_input.address else "",
            website=enterprise_input.website, # if enterprise_input.website else "",
            status=enterprise_input.status,
            subscription_tier=enterprise_input.subscription_tier,
            max_licenses=enterprise_input.max_licenses,
            used_licenses=enterprise_input.used_licenses,
            contract_start_date=enterprise_input.contract_start_date,
            contract_end_date=enterprise_input.contract_end_date,
            monthly_revenue=enterprise_input.monthly_revenue,

            created_date=current_time,
            updated_date=current_time,
            cognito_group_name= enterprise_input.name.replace(" ", "").upper(),
            created_by=user_id
        ),
    )
    return EnterpriseOutput(
        # TO DO
    )