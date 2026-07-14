use axum::{
    Json, Router, extract::State, http::StatusCode, routing::get
};

use crate::{db::check_db, handlers::redirect::redirect_url, routes::{auth::auth_routes, urls::urls_routes}, state::AppState, utils::{ApiResult, error::ApiError, response::ApiResponse}};

pub fn api_router() -> Router<AppState> {
    Router::new()
    .route("/health", get(health_check))
    .route("/redirect/{code}", get(redirect_url))
    .nest("/auth", auth_routes())
    .nest("/urls", urls_routes())
}

async fn health_check(State(state):State<AppState>) -> ApiResult<()> {
    let succeed = check_db(state.db).await;
    if succeed {
        let response:ApiResponse<()> = ApiResponse::success("Rust URL Shortener running...", ());
        Ok((StatusCode::OK,Json(response)))
    } else {
        Err(ApiError::Internal)
    }
}