use axum::{Json, extract::{Path, State}, http::StatusCode};
use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, EntityTrait, IntoActiveModel, QueryFilter, Set};
use serde::Deserialize;
use uuid::Uuid;

use crate::{entities::{prelude::*,url}, state::AppState, utils::{ApiResult, auth::Claims, error::ApiError, response::ApiResponse}};


#[derive(Deserialize)]
pub struct UpdatePayload {
    pub title: Option<String>,
} 

pub async fn update_url(claims: Claims, State(state): State<AppState>, Path(id): Path<String>, Json(payload): Json<UpdatePayload>) -> ApiResult<url::Model> {

    let url_id = Uuid::parse_str(&id).map_err(|_| ApiError::Internal)?;

    let url = Url::find()
        .filter(
            Condition::all()
                .add(url::Column::Id.eq(url_id))
                .add(url::Column::UserId.eq(claims.user_id))
        ).one(&state.db).await.map_err(|_| ApiError::Internal)?.ok_or(ApiError::NotFound)?;

    let mut active = url.into_active_model();
    active.title = Set(payload.title);

    let updated_url = active.update(&state.db).await.map_err(|_| ApiError::Internal)?;

    let response = ApiResponse::success("URL title updated successfully", updated_url);
    Ok((StatusCode::OK,Json(response)))

} 