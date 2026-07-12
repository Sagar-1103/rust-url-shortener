use axum::{
    Router,
    routing::get
};

pub fn api_router() -> Router {
    Router::new()
    .route("/", get( || async { "Rust URL Shortner running..." }))
}