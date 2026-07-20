use axum::{Json, extract::State, http::StatusCode};
use sea_orm::{ActiveModelTrait, ActiveValue::Set, ColumnTrait, EntityTrait, IntoActiveModel, QueryFilter};
use serde::{Deserialize};
use argon2::{
    password_hash::{
        rand_core::OsRng,
        PasswordHasher,
        SaltString,
    },
    Argon2,
};

use crate::{ entities::{prelude::*, user}, state::AppState, utils::{ApiResult, auth::{Claims, Tokens}, error::ApiError, response::ApiResponse}};

#[derive(Deserialize)]
pub struct SignupUserPayload {
    username: String,
    password: String,
} 

pub async fn signup_user(State(state):State<AppState>, Json(payload):Json<SignupUserPayload>) -> ApiResult<Tokens> {

    let existing_user = User::find().filter(user::Column::Username.eq(payload.username.trim())).one(&state.db).await.map_err(|_| ApiError::Internal)?;

    if existing_user.is_some() {
       return Err(ApiError::UserAlreadyExists); 
    }

    let salt = SaltString::generate(&mut OsRng);
    let hashed_password = Argon2::default().hash_password(payload.password.as_bytes(), &salt).map_err(|_| ApiError::Internal)?.to_string();

    let created_user = user::ActiveModel {
        username: Set(payload.username),
        password: Set(hashed_password),
        ..Default::default()
    };

    let user = created_user.insert(&state.db).await.map_err(|_| ApiError::Internal)?;

    let token_response = Claims::generate_token_pair(user.id);

    match token_response {
        Ok(tokens) => {
            let mut active = user.into_active_model();
            active.refresh_token = Set(Some(tokens.refresh_token.clone()));
            active.update(&state.db).await.map_err(|_| ApiError::Internal)?;
            let response = ApiResponse::success("User registered successfully", tokens);
            Ok((StatusCode::OK,Json(response)))
        },
        Err(err) => {
            Err(err)
        }
    }
}