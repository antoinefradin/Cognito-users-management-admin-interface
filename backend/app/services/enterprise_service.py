import logging

from app.routes.schemas.entreprise_schema import (
    EnterpriseInput,
    EnterpriseOutput,
    IndustryEnum,
    CompanySizeEnum,
    EnterpriseStatusEnum,
    SubscriptionTierEnum,
)
from app.repositories.models.enterprise_model import (
    EnterpriseModel,
    EnterpriseMeta,
)
from app.repositories.enterprise_repository import (
    store_enterprise,
    get_enterprises_by_contract_end_date
)
from app.repositories.common import decompose_enterprise_id

from app.utils import (
    get_current_time,
)

logger = logging.getLogger(__name__)


def create_new_enterprise(user_id: str, enterprise_input: EnterpriseInput) -> EnterpriseOutput:
    """Create a new enterprise."""

    logger.info(f"create_new_enterprise() function")
    logger.info(f"Create enterprise: {enterprise_input}") 

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
        id=enterprise_input.id,
        name=enterprise_input.name,
        industry=enterprise_input.industry,
        size=enterprise_input.size,
        contact_email=enterprise_input.contact_email,
        contact_phone=enterprise_input.contact_phone,
        address=enterprise_input.address,
        website=enterprise_input.website,
        status=enterprise_input.status,
        subscription_tier=enterprise_input.subscription_tier,
        max_licenses=enterprise_input.max_licenses,
        used_licenses=enterprise_input.used_licenses,
        contract_start_date=enterprise_input.contract_start_date,
        contract_end_date=enterprise_input.contract_end_date,
        monthly_revenue=enterprise_input.monthly_revenue,

        created_date=current_time,
        updated_date=current_time,
    )


def fetch_all_enterprises(limit: int = 20) -> list[EnterpriseMeta]:
    """Find all enterprises.
    The order is asceding by `contract_end_date`.
    """
    if limit and (limit < 0 or limit > 100):
        raise ValueError("Limit must be between 0 and 100")

    response = get_enterprises_by_contract_end_date(limit = limit)

    # logger.info(f"get all reponse:{response}")
    # logger.info(f"get all reponse items:{response["Items"]}")
    enterprises = []
    for item in response["Items"]:
        enterprises.append(
            EnterpriseMeta(
                id=decompose_enterprise_id(item["SK"]),
                name=item["name"],
                industry=item["industry"],
                website=item["website"],
                status=item["status"],
                subscription_tier=item["subscription_tier"],
                max_licenses=item["max_licenses"],
                used_licenses=item["used_licenses"],
                contract_end_date=item["contract_end_date"],
                monthly_revenue=item["monthly_revenue"],
            )
        )

    return enterprises