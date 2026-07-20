use crate::{ entities::{prelude::*, user}, state::AppState, utils::{ApiResult, auth::{Claims, Tokens}, error::ApiError, response::ApiResponse}};
use argon2::{ Argon2, PasswordHash, PasswordVerifier};
use axum::{Json, extract::State, http::StatusCode};
use sea_orm::{ActiveModelTrait, ActiveValue::Set, ColumnTrait, EntityTrait, IntoActiveModel, QueryFilter};
use serde::Deserialize;

#[derive(Deserialize)]
pub struct LoginUserPayload {
    username: String,
    password: String,
}

pub async fn login_user(State(state):State<AppState>, Json(payload):Json<LoginUserPayload>) -> ApiResult<Tokens> {
    let existing_user = User::find().filter(user::Column::Username.eq(&payload.username)).one(&state.db).await.map_err(|_| ApiError::Internal)?.ok_or(ApiError::InvalidCredentials)?;

    let hashed_password= PasswordHash::new(&existing_user.password).map_err(|_| ApiError::Internal)?;

    Argon2::default().verify_password(payload.password.as_bytes(),&hashed_password).map_err(|_| ApiError::InvalidCredentials)?;


    let token_response = Claims::generate_token_pair(existing_user.id);

    match token_response {
        Ok(tokens) => {
            let mut active = existing_user.into_active_model();
            active.refresh_token = Set(Some(tokens.refresh_token.clone()));
            active.update(&state.db).await.map_err(|_| ApiError::Internal)?;
            let response = ApiResponse::success("Login successfull", tokens);
            Ok((StatusCode::OK,Json(response)))
        },
        Err(err) => {
            Err(err)
        }
    }
}