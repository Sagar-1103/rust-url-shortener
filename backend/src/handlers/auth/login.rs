use crate::{config::env::ENV, utils::{ApiResult, auth::Claims, response::ApiResponse}};
use axum::{Json, http::StatusCode};
use uuid::Uuid;
use chrono::{Utc};

pub async fn login_user() -> ApiResult<String> {
    // find existing user , if user doesnt exist then return

    // generate the access token and the refresh token
    let exp = (Utc::now() + ENV.token_expiry_duration).timestamp() as usize;
    let claims = Claims {
        user_id: Uuid::new_v4(),
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