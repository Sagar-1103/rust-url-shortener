use axum::{Json, http::StatusCode};

use crate::utils::{ApiResult, auth::Claims, response::ApiResponse};

pub async fn get_user(claims: Claims) -> ApiResult<Claims> {
    
    let response = ApiResponse::success("Profile", claims);

    Ok((StatusCode::OK,Json(response)))
}