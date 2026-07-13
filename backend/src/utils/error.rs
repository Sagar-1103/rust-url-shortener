use axum::{Json, http::StatusCode, response::IntoResponse};
use thiserror::Error;

use crate::utils::response::ApiResponse;

#[derive(Error,Debug)]
pub enum ApiError {
    #[error("Internal Server Error")]
    Internal
}

impl ApiError {
    pub fn status(&self) -> StatusCode {
        match self {
            ApiError::Internal => StatusCode::INTERNAL_SERVER_ERROR,
        }
    }
}

impl IntoResponse for ApiError {
    fn into_response(self) -> axum::response::Response {
        let body:ApiResponse<()> = ApiResponse::error(self.to_string());
        (self.status(),Json(body)).into_response()
    }
}

pub type ApiResult<T> = Result<(StatusCode,Json<ApiResponse<T>>),ApiError>;