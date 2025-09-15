import logging

from backend.app.routes.schemas.entreprise_schema import (
    EnterpriseInput,
    EnterpriseOutput,
    IndustryEnum,
    CompanySizeEnum,
    EnterpriseStatusEnum,
    SubscriptionTierEnum,
)
from backend.app.repositories.models.enterprise_model import (
    EnterpriseModel,
    EnterpriseMeta,
)
from app.repositories.enterprise_repository import (
    store_enterprise,
    get_enterprises_by_contract_end_date
)
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
    """Find all private & shared bots of a user.
    The order is descending by `contract_end_date`.
    """
    if limit and (limit < 0 or limit > 100):
        raise ValueError("Limit must be between 0 and 100")

    response = get_enterprises_by_contract_end_date(limit = limit)

    logger.info(f"get all reponse:{response}")
    logger.info(f"get all reponse items:{response["Items"]}")
    enterprises = []
    for item in response["Items"]:
        print(item)
        # if "OriginalBotId" in item:
        #     # Fetch original bots of alias bots
        #     is_original_available = True
        #     try:
        #         bot = find_public_bot_by_id(tenant_id, item["OriginalBotId"])
        #         logger.info(f"Found original bot: {bot.id}")
        #         meta = BotMeta(
        #             id=bot.id,
        #             title=bot.title,
        #             create_time=float(bot.create_time),
        #             last_used_time=float(bot.last_used_time),
        #             is_pinned=item["IsPinned"],
        #             owned=False,
        #             available=True,
        #             description=bot.description,
        #             is_public=True,
        #             sync_status=bot.sync_status,
        #             has_bedrock_knowledge_base=bot.has_bedrock_knowledge_base(),
        #         )
        #     except RecordNotFoundError:
        #         # Original bot is removed
        #         is_original_available = False
        #         logger.info(f"Original bot {item['OriginalBotId']} has been removed")
        #         meta = BotMeta(
        #             id=item["OriginalBotId"],
        #             title=item["Title"],
        #             create_time=float(item["CreateTime"]),
        #             last_used_time=float(item["LastBotUsed"]),
        #             is_pinned=item["IsPinned"],
        #             owned=False,
        #             # NOTE: Original bot is removed
        #             available=False,
        #             description="This item is no longer available",
        #             is_public=False,
        #             sync_status="ORIGINAL_NOT_FOUND",
        #             has_bedrock_knowledge_base=False,
        #         )

        #     if is_original_available and (
        #         bot.title != item["Title"]
        #         or bot.description != item["Description"]
        #         or bot.sync_status != item["SyncStatus"]
        #         or bot.has_knowledge() != item["HasKnowledge"]
        #         or bot.conversation_quick_starters
        #         != [
        #             ConversationQuickStarter(**starter)
        #             for starter in item.get("ConversationQuickStarters", [])
        #         ]
        #     ):
        #         # Update alias to the latest original bot
        #         store_alias(
        #             user_id,
        #             BotAliasModel(
        #                 id=decompose_bot_alias_id(item["SK"]),
        #                 # Update title and description
        #                 title=bot.title,
        #                 description=bot.description,
        #                 original_bot_id=item["OriginalBotId"],
        #                 create_time=float(item["CreateTime"]),
        #                 last_used_time=float(item["LastBotUsed"]),
        #                 is_pinned=item["IsPinned"],
        #                 sync_status=bot.sync_status,
        #                 has_knowledge=bot.has_knowledge(),
        #                 has_agent=bot.is_agent_enabled(),
        #                 conversation_quick_starters=bot.conversation_quick_starters,
        #             ),
        #         )

        #     bots.append(meta)
        # else:
        #     # Private bots
        #     bots.append(
        #         BotMeta(
        #             id=decompose_bot_id(item["SK"]),
        #             title=item["Title"],
        #             create_time=float(item["CreateTime"]),
        #             last_used_time=float(item["LastBotUsed"]),
        #             is_pinned=item["IsPinned"],
        #             owned=True,
        #             available=True,
        #             description=item["Description"],
        #             is_public="PublicBotId" in item,
        #             sync_status=item["SyncStatus"],
        #             has_bedrock_knowledge_base=(
        #                 True if item.get("BedrockKnowledgeBase", None) else False
        #             ),
        #         )
        #     )

    return enterprises