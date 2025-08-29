from typing import Literal
from fastapi import APIRouter, Request, Depends, HTTPException, Query, BackgroundTasks
import logging


from app.dependencies import check_creating_license_enterprise_allowed, check_admin
from app.user import User
from app.routes.schemas.entreprise import (
    EnterpriseInput, 
    EnterpriseOutput, 
    EnterpriseUpdate, 
    # EnterpriseListOutput,
    # EnterpriseLicenseUpdate,
    # EnterpriseStatsOutput,
    # BulkEnterpriseOperation,
    # BulkOperationResult,
    # IndustryEnum,
    # CompanySizeEnum,
    # EnterpriseStatusEnum,
    # SubscriptionTierEnum
)
from app.services.enterprise_service import (
     create_new_enterprise,
#     get_enterprise_by_id,
#     get_enterprises_list,
#     update_enterprise,
#     delete_enterprise,
#     update_enterprise_licenses,
#     get_enterprise_stats,
#     bulk_update_enterprises
)


logger = logging.getLogger(__name__)



router = APIRouter(tags=["enterprise"])#, prefix="/enterprise")


@router.post("/enterprise", response_model=EnterpriseOutput)
def create_enterprise(
    request: Request,
    enterprise_input: EnterpriseInput,
    # background_tasks: BackgroundTasks,
    check_creating_enterprise_allowed=Depends(check_creating_license_enterprise_allowed), 
    check_admin_permissions=Depends(check_admin),
):
    """
    Create a new Enterprise:
    - Save the Enterprise in DynamoDB
    """
    logger.info(f"/enterprise")

    current_user: User = request.state.current_user
    
    # Run only if check_creating_entreprise_allowed() and check_admin() are True
    # 1. Creation in DB 
    enterprise = create_new_enterprise(
        user_id=current_user.id,
        enterprise_input=enterprise_input,
    )

    # 2. Background task (async)
    #background_tasks.add_task(sync_cognito_group, enterprise.id)
    
    return enterprise







# @router.get("/", response_model=EnterpriseListOutput)
# def list_enterprises(
#     request: Request,
#     page: int = Query(1, ge=1, description="Numéro de page"),
#     per_page: int = Query(20, ge=1, le=100, description="Éléments par page"),
#     search: Optional[str] = Query(None, min_length=2, description="Recherche par nom"),
#     industry: Optional[IndustryEnum] = Query(None, description="Filtrer par secteur"),
#     size: Optional[CompanySizeEnum] = Query(None, description="Filtrer par taille"),
#     status: Optional[EnterpriseStatusEnum] = Query(None, description="Filtrer par statut"),
#     subscription_tier: Optional[SubscriptionTierEnum] = Query(None, description="Filtrer par abonnement"),
#     admin_check=Depends(check_admin_permissions),
# ):
#     """
#     Lister toutes les entreprises avec pagination et filtres avancés.
#     """
#     current_user: User = request.state.current_user
    
#     return get_enterprises_list(
#         user_id=current_user.id,
#         tenant=current_user.tenant,
#         page=page,
#         per_page=per_page,
#         search=search,
#         industry=industry,
#         size=size,
#         status=status,
#         subscription_tier=subscription_tier
#     )


# @router.get("/stats", response_model=EnterpriseStatsOutput)
# def get_enterprises_statistics(
#     request: Request,
#     admin_check=Depends(check_admin_permissions),
# ):
#     """
#     Obtenir les statistiques globales des entreprises.
#     """
#     current_user: User = request.state.current_user
    
#     return get_enterprise_stats(
#         user_id=current_user.id,
#         tenant=current_user.tenant
#     )


# @router.get("/{enterprise_id}", response_model=EnterpriseOutput)
# def get_enterprise(
#     request: Request,
#     enterprise_id: str,
#     admin_check=Depends(check_admin_permissions),
# ):
#     """
#     Récupérer une entreprise par son ID.
#     """
#     current_user: User = request.state.current_user
    
#     enterprise = get_enterprise_by_id(
#         enterprise_id=enterprise_id,
#         user_id=current_user.id,
#         tenant=current_user.tenant
#     )
    
#     if not enterprise:
#         raise HTTPException(status_code=404, detail="Entreprise non trouvée")
    
#     return enterprise


# @router.put("/{enterprise_id}", response_model=EnterpriseOutput)
# def update_enterprise_data(
#     request: Request,
#     enterprise_id: str,
#     enterprise_update: EnterpriseUpdate,
#     background_tasks: BackgroundTasks,
#     admin_check=Depends(check_admin_permissions),
# ):
#     """
#     Mettre à jour les données d'une entreprise.
#     """
#     current_user: User = request.state.current_user
    
#     updated_enterprise = update_enterprise(
#         enterprise_id=enterprise_id,
#         user_id=current_user.id,
#         tenant=current_user.tenant,
#         update_data=enterprise_update,
#         background_tasks=background_tasks
#     )
    
#     if not updated_enterprise:
#         raise HTTPException(status_code=404, detail="Entreprise non trouvée")
    
#     return updated_enterprise


# @router.patch("/{enterprise_id}/licenses", response_model=EnterpriseOutput)
# def update_enterprise_licenses(
#     request: Request,
#     enterprise_id: str,
#     license_update: EnterpriseLicenseUpdate,
#     admin_check=Depends(check_admin_permissions),
# ):
#     """
#     Mettre à jour le nombre de licences d'une entreprise.
#     """
#     current_user: User = request.state.current_user
    
#     updated_enterprise = update_enterprise_licenses(
#         enterprise_id=enterprise_id,
#         user_id=current_user.id,
#         tenant
