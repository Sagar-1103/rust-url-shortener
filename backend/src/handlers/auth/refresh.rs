use axum::{Json, extract::State, http::StatusCode};
use sea_orm::{ActiveModelTrait, ActiveValue::Set, EntityTrait, IntoActiveModel};
use serde::Deserialize;

use crate::{entities::{prelude::*}, state::AppState, utils::{ApiResult, auth::{Claims, Tokens}, error::ApiError, response::ApiResponse}};

#[derive(Deserialize)]
pub struct RefreshPayload {
    refresh_token: String,
}

pub async fn refresh_tokens(State(state):State<AppState>, Json(payload): Json<RefreshPayload>) -> ApiResult<Tokens> {
    let claims = Claims::verify_refresh_token(&payload.refresh_token)?;

    let user = User::find_by_id(claims.user_id).one(&state.db).await.map_err(|_| ApiError::Internal)?.ok_or(ApiError::InvalidRefreshToken)?;

    if user.refresh_token.as_deref() != Some(&payload.refresh_token) {
        return Err(ApiError::InvalidRefreshToken);
    }

    let tokens = Claims::generate_token_pair(user.id)?;

    let mut active = user.into_active_model();
    active.refresh_token = Set(Some(tokens.refresh_token.clone()));
    active.update(&state.db).await.map_err(|_| ApiError::Internal)?;

    let response = ApiResponse::success("Tokens refreshsed successfully", tokens);

    Ok((StatusCode::OK,Json(response)))
}