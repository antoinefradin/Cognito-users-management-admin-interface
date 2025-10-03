import logging

from app.routes.schemas.entreprise_schema import (
    EnterpriseInput,
    EnterpriseOutput,
    EnterpriseModifyInput,
    EnterpriseModifyOutput,
    EnterpriseMetaOutput,
)
from app.repositories.models.enterprise_model import (
    EnterpriseModel,
    EnterpriseMeta,
)
from app.repositories.enterprise_repository import (
    store_enterprise,
    get_enterprises_by_contract_end_date,
    find_enterprise_by_id,
    update_enterprise,
    is_enterprise_exists,
    delete_enterprise_by_id,
)
from app.repositories.common import (
    RecordNotFoundError, 
    decompose_enterprise_id,
)
from app.utils import (
    get_current_time,
)
from app.services.event_service import create_new_event
from app.repositories.models.event_model import (
    EventNameEnum, EventTypeEnum,EntityTypeEnum
)


logger = logging.getLogger(__name__)


def create_new_enterprise(user_id: str, enterprise_input: EnterpriseInput) -> EnterpriseOutput:
    """Create a new enterprise."""
    current_time = get_current_time()
    store_enterprise(
        user_id,
        EnterpriseModel(
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
            cognito_group_name= enterprise_input.name.replace(" ", "").upper(),
            created_by=user_id
        ),
    )

    # Enterprise INSERT event    
    create_new_event(
        user_id=user_id,
        event_date=current_time,
        event_name=EventNameEnum.INSERT,
        event_type=EventTypeEnum.ENTERPRISE_CREATED,
        entity_id=enterprise_input.id,
        entity_type=EntityTypeEnum.ENTERPRISE,
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
    )

def modify_enterprise(user_id: str, enterprise_id: str, modify_input: EnterpriseModifyInput) -> EnterpriseModifyOutput:
    """Update an existing enterprise."""
    current_time = get_current_time()

    logger.info("update_enterprise() function")
    logger.info(f"Updating enterprise: {enterprise_id}")

    try: 
        if is_enterprise_exists(enterprise_id):
            update_enterprise(
                enterprise_id=enterprise_id,
                contract_start_date=modify_input.contract_start_date,
                updated_date=current_time,
                updated_by=user_id,
                industry=modify_input.industry,
                size=modify_input.size,
                status=modify_input.status,
                contact_email=modify_input.contact_email,
                contact_phone=modify_input.contact_phone,
                address=modify_input.address,
                website=modify_input.website,
                subscription_tier=modify_input.subscription_tier,
                max_licenses=modify_input.max_licenses,
                used_licenses=modify_input.used_licenses,
                monthly_revenue=modify_input.monthly_revenue,
                contract_end_date=modify_input.contract_end_date,
            )

            # Enterprise MODIFY event    
            create_new_event(
                user_id=user_id,
                event_date=current_time,
                event_name=EventNameEnum.MODIFY,
                event_type=EventTypeEnum.ENTERPRISE_UPDATED,
                entity_id=enterprise_id,
                entity_type=EntityTypeEnum.ENTERPRISE,
            )

            return EnterpriseModifyOutput(
                id=enterprise_id,
                name=modify_input.name,
                industry=modify_input.industry,
                size=modify_input.size,
                contact_email=modify_input.contact_email,
                contact_phone=modify_input.contact_phone,
                address=modify_input.address,
                website=modify_input.website,
                status=modify_input.status,
                subscription_tier=modify_input.subscription_tier,
                max_licenses=modify_input.max_licenses,
                used_licenses=modify_input.used_licenses,
                contract_start_date=modify_input.contract_start_date,
                contract_end_date=modify_input.contract_end_date,
                monthly_revenue=modify_input.monthly_revenue,
                updated_date=current_time,
                )
    
    except RecordNotFoundError as e:
        logger.error(f"Enterprise not found: {e}")
        raise



def fetch_all_enterprises(limit: int = 20) -> list[EnterpriseMeta]:
    """Find all enterprises.
    The order is asceding by `contract_end_date`.
    """
    if limit and (limit < 0 or limit > 100):
        raise ValueError("Limit must be between 0 and 100")

    response = get_enterprises_by_contract_end_date(limit = limit)

    enterprises = []
    for item in response["Items"]:
        enterprises.append(
            EnterpriseMeta(
                id=decompose_enterprise_id(item["SK"]),
                name=item["Name"],
                industry=item["Industry"],
                website=item["Website"],
                status=item["Status"],
                subscription_tier=item["SubscriptionTier"],
                max_licenses=item["MaxLicenses"],
                used_licenses=item["UsedLicenses"],
                contract_end_date=item["ContractEndDate"],
                monthly_revenue=item["MonthlyRevenue"],
            )
        )
    return enterprises



def fetch_enterprise(enterprise_id: str) -> EnterpriseModel:
    """Fetch enterprise by id."""
    try:
        return find_enterprise_by_id(enterprise_id)
    except RecordNotFoundError:
        raise RecordNotFoundError(
            f"Enterprise with ID {enterprise_id} not found in database items."
        )
    


def remove_enterprise_by_id(user_id: str, enterprise_id: str) -> EnterpriseMetaOutput:
    """Remove an existing enterprise."""
    current_time = get_current_time()

    logger.info(f"remove_enterprise_by_id() function")
    logger.info(f"Remove enterprise: {enterprise_id}")

    """Remove bot by id."""
    if is_enterprise_exists(enterprise_id):
        try:
            response = delete_enterprise_by_id(enterprise_id)
            
            # Enterprise MODIFY event    
            create_new_event(
                user_id=user_id,
                event_date=current_time,
                event_name=EventNameEnum.REMOVE,
                event_type=EventTypeEnum.ENTERPRISE_DELETED,
                entity_id=enterprise_id,
                entity_type=EntityTypeEnum.ENTERPRISE,
            )

            return response

        except RecordNotFoundError as e:
            logger.error(f"Enterprise deletion failed: {e}")
            pass