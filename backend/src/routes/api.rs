use axum::{
    Json, Router, http::StatusCode, routing::get
};

use crate::utils::{ApiResult, error::ApiError, response::ApiResponse};

pub fn api_router() -> Router {
    Router::new()
    .route("/health", get(health_check))
}

async fn health_check() -> ApiResult<()> {
    let succeed = true;
    if succeed {
        let response:ApiResponse<()> = ApiResponse::success("Rust URL Shortener running...", ());
        Ok((StatusCode::OK,Json(response)))
    } else {
        Err(ApiError::Internal)
    }
}