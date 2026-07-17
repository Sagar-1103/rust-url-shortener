use crate::utils::{ApiResult, auth::Claims, response::ApiResponse};
use axum::{Json, http::StatusCode};
use uuid::Uuid;
use chrono::{Duration,Utc};

pub async fn login_user() -> ApiResult<String> {
    let exp = (Utc::now() + Duration::minutes(15)).timestamp() as usize;
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