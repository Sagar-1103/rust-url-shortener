use axum::{
    Router,
    routing::get,
};


pub fn create_router() -> Router {
    Router::new()
    .route("/",get(|| async { "Rust URL Shortener" }))
}