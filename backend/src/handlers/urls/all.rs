use axum::{Json, extract::State, http::StatusCode};
use sea_orm::{ColumnTrait, EntityTrait, QueryFilter};

use crate::{entities::{prelude::*, url::{self, Model}}, state::AppState, utils::{ApiResult, auth::Claims, error::ApiError, response::ApiResponse}};

pub async fn get_urls(claims: Claims, State(state): State<AppState>) -> ApiResult<Vec<Model>> {
    let shortened_urls = Url::find().filter(url::Column::UserId.eq(claims.user_id)).all(&state.db).await.map_err(|_| ApiError::Internal)?;
    let response = ApiResponse::success("All URLs fetched successfully", shortened_urls);
    Ok((StatusCode::OK,Json(response)))
}