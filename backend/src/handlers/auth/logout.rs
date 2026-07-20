use axum::{Json, extract::State, http::StatusCode};
use sea_orm::{ActiveModelTrait, ActiveValue::Set, EntityTrait, IntoActiveModel};

use crate::{entities::prelude::*, state::AppState, utils::{ApiResult, auth::Claims, error::ApiError, response::ApiResponse}};

pub async fn logout_user(claims: Claims,State(state):State<AppState>) -> ApiResult<()> {

    let user = User::find_by_id(claims.user_id).one(&state.db).await.map_err(|_| ApiError::Internal)?.ok_or(ApiError::NotFound)?;
    
    let mut active = user.into_active_model();
    active.refresh_token = Set(None);
    active.update(&state.db).await.map_err(|_| ApiError::Internal)?;

    let response = ApiResponse::success("User logged out successfully", ());

    Ok((StatusCode::OK,Json(response))) 
}