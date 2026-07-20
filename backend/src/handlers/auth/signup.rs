use axum::{Json, extract::State, http::StatusCode};
use chrono::Utc;
use sea_orm::{ActiveModelTrait, ActiveValue::Set, ColumnTrait, EntityTrait, QueryFilter};
use serde::{Deserialize};
use argon2::{
    password_hash::{
        rand_core::OsRng,
        PasswordHasher,
        SaltString,
    },
    Argon2,
};

use crate::{config::env::ENV, entities::{prelude::*, user}, state::AppState, utils::{ApiResult, auth::Claims, error::ApiError, response::ApiResponse}};

#[derive(Deserialize)]
pub struct SignupUserPayload {
    username: String,
    password: String,
} 

pub async fn signup_user(State(state):State<AppState>, Json(payload):Json<SignupUserPayload>) -> ApiResult<String> {

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

    let exp = (Utc::now() + ENV.token_expiry_duration).timestamp() as usize;

    let claims = Claims {
        user_id: user.id,
        exp,
    };

    let token_response = Claims::generate_token(&claims);

    match token_response {
        Ok(token) => {
            let response = ApiResponse::success("User registered successfully", token);
            Ok((StatusCode::OK,Json(response)))
        },
        Err(err) => {
            Err(err)
        }
    }
}