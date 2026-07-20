use axum::{Json, extract::State, http::StatusCode};
use sea_orm::{ActiveModelTrait, ActiveValue::Set};
use serde::{Deserialize};

use crate::{entities::url::{self, Model}, state::AppState, utils::{ApiResult, auth::Claims, error::ApiError, response::ApiResponse}};

#[derive(Deserialize)]
pub struct ShortenUrl {
    url: String,
}

pub async fn shorten_url(claims: Claims,State(state):State<AppState>,Json(payload):Json<ShortenUrl>) -> ApiResult<Model> {
    let code = nanoid::nanoid!(8);

    let created_url = url::ActiveModel {
        user_id: Set(claims.user_id),
        original_url: Set(payload.url),
        code: Set(code),
        ..Default::default()
    };

    let shortened_url = created_url.insert(&state.db).await.map_err(|_| ApiError::Internal)?;

    let response = ApiResponse::success("Url Shortened successfully",shortened_url);
    Ok((StatusCode::OK,Json(response)))
}