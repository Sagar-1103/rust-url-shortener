use axum::extract::State;
use axum::{Json, http::StatusCode};
use sea_orm::{ColumnTrait, EntityTrait, QueryFilter};
use crate::entities::user::Model;
use crate::state::AppState;
use crate::utils::error::ApiError;
use crate::{entities::{prelude::*, user}, utils::{ApiResult, auth::Claims, response::ApiResponse}};

pub async fn get_user(claims: Claims,State(state):State<AppState>) -> ApiResult<Model> {

    let user = User::find().filter(user::Column::Id.eq(claims.user_id)).one(&state.db).await.map_err(|_| ApiError::Internal)?.ok_or(ApiError::NotFound)?;
    
    let response = ApiResponse::success("User fetched successfully", user);

    Ok((StatusCode::OK,Json(response)))
}