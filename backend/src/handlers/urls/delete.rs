use axum::{Json, extract::{Path, State}, http::StatusCode};
use sea_orm::{ColumnTrait, Condition, EntityTrait, QueryFilter};
use uuid::Uuid;

use crate::{state::AppState, entities::{prelude::*,url}, utils::{ApiResult, auth::Claims, error::ApiError, response::ApiResponse}};

pub async fn delete_url(claims: Claims, Path(id): Path<String>, State(state): State<AppState>) -> ApiResult<()> {
    let url_id = Uuid::parse_str(&id).map_err(|_| ApiError::Internal)?;

    let deleted_url = Url::delete_many()
        .filter(
            Condition::all()
                .add(url::Column::Id.eq(url_id))
                .add(url::Column::UserId.eq(claims.user_id))
        ).exec(&state.db).await.map_err(|_| ApiError::Internal)?;

    if deleted_url.rows_affected == 0 {
        return Err(ApiError::NotFound);
    }

    let response = ApiResponse::success("URL deleted successfully", ());
    Ok((StatusCode::OK,Json(response)))
}