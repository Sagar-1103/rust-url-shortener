use axum::{Json, extract::{Path, State}, http::StatusCode};
use sea_orm::{ColumnTrait, Condition, EntityTrait, QueryFilter};
use uuid::Uuid;

use crate::{entities::{prelude::*, url::{self, Model}}, state::AppState, utils::{ApiResult, auth::Claims, error::ApiError, response::ApiResponse}};

pub async fn get_url(claims: Claims,State(state):State<AppState>,Path(id):Path<String>) -> ApiResult<Model> {
    let url_id = Uuid::parse_str(&id).map_err(|_| ApiError::Internal)?;
    let shortened_url = Url::find()
    .filter(
        Condition::all()
            .add(url::Column::Id.eq(url_id))
            .add(url::Column::UserId.eq(claims.user_id))
    )
    .one(&state.db).await.map_err(|_| ApiError::Internal)?.ok_or(ApiError::NotFound)?;

    let response = ApiResponse::success("Shortened URL fetched successfully", shortened_url);
    Ok((StatusCode::OK,Json(response)))
}