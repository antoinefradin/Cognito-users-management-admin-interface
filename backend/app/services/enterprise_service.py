from app.routes.schemas.entreprise import (
    EnterpriseInput,
    EnterpriseOutput,
    IndustryEnum,
    CompanySizeEnum,
    EnterpriseStatusEnum,
    SubscriptionTierEnum,

)
from app.utils import (
    get_current_time,
)





def create_new_bot(user_id: str, enterprise_input: EnterpriseInput) -> EnterpriseOutput:
    """Create a new enterprise."""
    current_time = get_current_time()

    # TO DO
    store_enterprise(
        user_id,
        EnterpriseModel(
            id=enterprise_input.id,
            name=enterprise_input.name,
            industry=enterprise_input.industry if bot_input.description else "",
            instruction=bot_input.instruction,
            create_time=current_time,
            last_used_time=current_time,
            owner_user_id=user_id,  # Owner is the creator
            owner_tenant_id=tenant_id, # Tenant verification

            # TO DO
        ),
    )
    return EnterpriseOutput(
        # TO DO
    )