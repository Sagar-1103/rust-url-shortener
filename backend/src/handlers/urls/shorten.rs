use axum::{Json, http::StatusCode};
use serde::{Serialize,Deserialize};
use uuid::Uuid;

use crate::utils::{ApiResult, response::ApiResponse};

#[derive(Deserialize)]
pub struct ShortenUrl {
    url: String,
}

#[derive(Serialize)]
pub struct Url {
    code: Uuid,
    url: String,
}

pub async fn shorten_url(Json(payload):Json<ShortenUrl>) -> ApiResult<Url> {
    let code = Uuid::new_v4();

    let url = Url {
        code,
        url: payload.url
    };

    let response:ApiResponse<Url> = ApiResponse::success("Url Shortened successfully",url);
    Ok((StatusCode::OK,Json(response)))
}