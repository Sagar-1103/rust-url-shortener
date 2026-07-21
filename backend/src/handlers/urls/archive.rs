use axum::{Json, extract::{Path, State}, http::StatusCode};
use sea_orm::{ActiveModelTrait, ColumnTrait, Condition, EntityTrait, IntoActiveModel, QueryFilter, Set};
use uuid::Uuid;

use crate::{entities::{prelude::*,url}, state::AppState, utils::{ApiResult, auth::Claims, error::ApiError, response::ApiResponse}};

pub async fn toggle_archive(claims: Claims, Path(id): Path<String>,State(state):State<AppState>) -> ApiResult<()> {
    let url_id = Uuid::parse_str(&id).map_err(|_| ApiError::Internal)?;

    let url = Url::find()
            .filter(
                Condition::all()
                    .add(url::Column::Id.eq(url_id))
                    .add(url::Column::UserId.eq(claims.user_id))
            )
            .one(&state.db).await.map_err(|_| ApiError::Internal)?.ok_or(ApiError::NotFound)?;

    let mut active = url.into_active_model();
    active.archived = Set(!(active.archived.unwrap()));

    active.update(&state.db).await.map_err(|_| ApiError::Internal)?;

    let response = ApiResponse::success("Toggled sucessfully", ());

    Ok((StatusCode::OK,Json(response)))
}