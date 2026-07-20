use crate::{config::env::ENV, entities::{prelude::*, user}, state::AppState, utils::{ApiResult, auth::Claims, error::ApiError, response::ApiResponse}};
use argon2::{ Argon2, PasswordHash, PasswordVerifier};
use axum::{Json, extract::State, http::StatusCode};
use sea_orm::{ColumnTrait, EntityTrait, QueryFilter};
use serde::Deserialize;
use chrono::{Utc};

#[derive(Deserialize)]
pub struct LoginUserPayload {
    username: String,
    password: String,
}

pub async fn login_user(State(state):State<AppState>, Json(payload):Json<LoginUserPayload>) -> ApiResult<String> {
    let existing_user = User::find().filter(user::Column::Username.eq(&payload.username)).one(&state.db).await.map_err(|_| ApiError::Internal)?.ok_or(ApiError::InvalidCredentials)?;

    let hashed_password= PasswordHash::new(&existing_user.password).map_err(|_| ApiError::Internal)?;

    Argon2::default().verify_password(payload.password.as_bytes(),&hashed_password).map_err(|_| ApiError::InvalidCredentials)?;

    let exp = (Utc::now() + ENV.token_expiry_duration).timestamp() as usize;
    let claims = Claims {
        user_id: existing_user.id,
        exp
    };

    let token_response = Claims::generate_token(&claims);

    match token_response {
        Ok(token) => {
            let response = ApiResponse::success("Login successfull", token);
            Ok((StatusCode::OK,Json(response)))
        },
        Err(err) => {
            Err(err)
        }
    }
}